
import unittest

from app import app


class PortfolioAppTests(unittest.TestCase):

    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_home_page_loads(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Ian Tellah", response.data)

    def test_health_endpoint(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"status": "ok"})

    def test_contact_rejects_invalid_email(self):
        response = self.client.post(
            "/contact",
            data={
                "name": "Test User",
                "email": "not-an-email",
                "message": "Hello"
            },
            follow_redirects=True
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn(b"valid email", response.data)


if __name__ == "__main__":
    unittest.main()
