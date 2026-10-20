<<<<<<< HEAD

# Ian Tellah — Portfolio Website

A personal portfolio built with Python, Flask, HTML, CSS, and JavaScript.

## Features

- Responsive design for phones, tablets, and computers
- Dark charcoal and amber visual theme
- About, skills, projects, and contact sections
- Mobile navigation and scroll-reveal effects
- Contact form with server-side validation
- Optional SMTP email delivery
- Health-check endpoint
- Automated application tests

## Project structure

```text
ian-portfolio/
├── app.py
├── requirements.txt
├── .gitignore
├── .env.example
├── README.md
├── templates/
│   ├── base.html
│   └── index.html
├── static/
│   ├── css/style.css
│   ├── js/main.js
│   └── img/
└── tests/
    └── test_app.py
```

## Requirements

- Python 3.10 or newer
- VS Code (recommended)
- Git (for version control)

## Run locally on Windows

Open this folder in VS Code.

Choose Terminal -> New Terminal.

Run these commands one at a time:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open this address in your browser:

http://127.0.0.1:5000

Keep the terminal running while you use the website.

If virtual-environment activation is blocked, use:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

## Contact form email setup

The contact form requires SMTP credentials before it can send messages.

1. Copy `.env.example` to a local file named `.env`.
2. Enter SMTP settings supplied by your email provider.
3. Set those values as environment variables in your terminal or hosting service.
4. Test the form with a message you can verify.

This starter does not automatically load `.env` files. On Windows PowerShell, set variables in the current terminal session like this:

```powershell
$env:FLASK_SECRET_KEY = "replace-with-a-long-random-secret"
$env:CONTACT_RECIPIENT = "iantellah@gmail.com"
$env:SMTP_HOST = "your-provider-smtp-host"
$env:SMTP_PORT = "587"
$env:SMTP_USERNAME = "your-smtp-username"
$env:SMTP_PASSWORD = "your-smtp-password"
$env:SMTP_FROM = "your-verified-sender@example.com"
python app.py
```

Use provider-issued SMTP credentials or an app-specific password, not your regular email password.

Do not commit `.env` or publish secrets.

Until email delivery is configured, visitors can contact Ian using the direct email link on the page.

## Run tests

With the dependencies installed, run:

```powershell
python -m unittest discover -s tests
```

## Git version control

Initialize Git and create the first commit:

```bash
git init
git status
git add .
git commit -m "Initial portfolio website"
```

Before pushing to GitHub, check that `.env` and `.venv` are not included.

Create an empty repository on GitHub, then follow GitHub's instructions to connect the repository and push your code.

GitHub stores the source code; it does not automatically host this Flask application.

## Before launch

- Replace starter project cards with genuine completed work.
- Verify all descriptions and skills accurately represent your abilities.
- Configure and test contact-form email delivery.
- Set a strong secret key through the hosting environment.
- Use a production WSGI server rather than Flask's debug server.
- Enable HTTPS on the deployed website.
- Consider rate limiting and spam protection for the public form.

## Content note

Project cards are starting points for your portfolio, not claims of completed client work. Replace them with real projects, screenshots, and links as you build them.
=======
# ian-tellah-portfolio
>>>>>>> 67c7e0b505dcadef97bf6503d8f2cb46579f0953
