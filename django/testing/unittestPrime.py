import unittest

from prime import is_prime

class Tests(unittest.TestCase):

    def test_1(self):
        """Check 1 is Not a prime"""
        self.assertFalse(is_prime(1))

    def test_2(self):
        """Check 2 is a prime"""
        self.assertTrue(is_prime(2))

    def test_fails(self):
        """This function allways fails"""
        self.assertTrue(10 == 11)

if __name__ == '__main__':
    unittest.main()
