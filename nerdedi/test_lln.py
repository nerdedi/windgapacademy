import unittest

def calculate_reading_level(text):
    return "Beginner" if len(text.split()) < 50 else "Intermediate"

class TestLLN(unittest.TestCase):
    def test_short_text(self):
        self.assertEqual(calculate_reading_level("This is a short sentence."), "Beginner")

    def test_long_text(self):
        long_text = "word " * 60
        self.assertEqual(calculate_reading_level(long_text), "Intermediate")

if __name__ == "__main__":
    unittest.main()
