
import os
import re
import smtplib
import xml.etree.ElementTree as ET
from email.message import EmailMessage

from flask import (
    Flask,
    Response,
    flash,
    redirect,
    render_template,
    request,
    url_for,
)


app = Flask(__name__)

DEFAULT_SITE_URL = "https://ian-tellah-portfolio-1.onrender.com"
SITE_URL = (os.environ.get("SITE_URL") or DEFAULT_SITE_URL).strip().rstrip("/")


@app.context_processor
def inject_site_url():
    return {"site_url": SITE_URL}


@app.route("/robots.txt")
def robots():
    body = (
        "User-agent: *\n"
        "Allow: /\n"
        "\n"
        f"Sitemap: {SITE_URL}/sitemap.xml\n"
    )
    response = Response(body, mimetype="text/plain")
    response.headers["Cache-Control"] = "public, max-age=300, must-revalidate"
    return response


@app.route("/sitemap.xml")
def sitemap():
    namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
    ET.register_namespace("", namespace)
    urlset = ET.Element(f"{{{namespace}}}urlset")
    url = ET.SubElement(urlset, f"{{{namespace}}}url")
    location = ET.SubElement(url, f"{{{namespace}}}loc")
    location.text = f"{SITE_URL}/"

    xml = ET.tostring(urlset, encoding="utf-8", xml_declaration=True)
    response = Response(xml, mimetype="application/xml")
    response.headers["Cache-Control"] = "public, max-age=3600"
    return response

app.secret_key = os.environ.get(
    "FLASK_SECRET_KEY",
    "local-development-key-change-before-deployment"
)


def valid_email(email):
    """Basic validation for an email address."""
    return bool(
        re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email or "")
    )


def send_contact_email(name, email, message):
    """Send a contact message using configured SMTP credentials."""

    host = os.environ.get("SMTP_HOST")
    port = int(os.environ.get("SMTP_PORT", "587"))
    username = os.environ.get("SMTP_USERNAME")
    password = os.environ.get("SMTP_PASSWORD")
    sender = os.environ.get("SMTP_FROM", username or "")
    recipient = os.environ.get(
        "CONTACT_RECIPIENT",
        "iantellah@gmail.com"
    )

    # Do not pretend a message was sent if email is not configured.
    if not all([host, username, password, sender, recipient]):
        return False

    email_message = EmailMessage()
    email_message["Subject"] = f"Portfolio message from {name}"
    email_message["From"] = sender
    email_message["To"] = recipient
    email_message["Reply-To"] = email
    email_message.set_content(
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}"
    )

    with smtplib.SMTP(host, port, timeout=15) as server:
        server.starttls()
        server.login(username, password)
        server.send_message(email_message)

    return True


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/contact")
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not valid_email(email) or not message:
        flash(
            "Please enter your name, a valid email, and a message.",
            "error"
        )
        return redirect(url_for("home", _anchor="contact"))

    if len(name) > 100 or len(email) > 254 or len(message) > 5000:
        flash(
            "One of your fields is too long. Please shorten it.",
            "error"
        )
        return redirect(url_for("home", _anchor="contact"))

    try:
        sent = send_contact_email(name, email, message)
    except (OSError, smtplib.SMTPException) as error:
        app.logger.warning("Contact email failed: %s", error)
        sent = False

    if sent:
        flash(
            "Thanks for reaching out. Your message has been sent.",
            "success"
        )
    else:
        flash(
            "Email delivery is not configured yet. "
            "Please contact Ian using the email link on this page.",
            "error"
        )

    return redirect(url_for("home", _anchor="contact"))


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    # Local development only. Do not use debug mode in production.
    app.run(debug=True)
