import os
import pathlib
import unittest

from selenium import webdriver

# load file into chrome
def file_url(filename):
    return pathlib.Path(os.path.abspath(filename)).as_uri()

chromedriver_path = os.environ.get('CHROMEWEBDRIVER', 'chromedriver.exe')

print(f'Using chromedriver: {chromedriver_path}')

options = webdriver.ChromeOptions()
options.headless = True

driver = webdriver.Chrome(executable_path=chromedriver_path, options=options)

class WebpageTests(unittest.TestCase):        

    _driver = driver

    def test_title(self):
        driver.get(file_url("counter.html"))
        self.assertEqual(driver.title, "Counter")

    def test_clicking_increment_increase_count(self):
        driver.get(file_url("counter.html"))
        increase = driver.find_element_by_id("counter-increase")

        for i in range(10):
            increase.click()
        
        counter = driver.find_element_by_id("counter")
        self.assertEqual(counter.text, "10")

    def test_clicking_deincrement_decreases_count(self):
        driver.get(file_url("counter.html"))
        deincrement = driver.find_element_by_id("counter-decrease")

        for i in range(10):
            deincrement.click()
        
        counter = driver.find_element_by_id("counter")
        self.assertEqual(counter.text, "-10")
    
    @classmethod
    def tearDownClass(cls):
        cls._driver.close()
        cls._driver.quit()

if __name__ == '__main__':
    unittest.main()
   
