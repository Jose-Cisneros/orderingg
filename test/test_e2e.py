import unittest
import os
import time
import threading

from selenium import webdriver
from selenium.webdriver.support.ui import Select
from app import create_app, db
from app.models import Product, Order, OrderProduct

basedir = os.path.abspath(os.path.dirname(__file__))

from werkzeug.serving import make_server

class Ordering(unittest.TestCase):
    # Creamos la base de datos de test
    def setUp(self):
        self.app = create_app()
        self.app.config.update(
            SQLALCHEMY_DATABASE_URI='sqlite:///' + os.path.join(basedir, 'test.db'),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            TESTING=True
        )

        self.app_context = self.app.app_context()
        self.app_context.push()

        self.baseURL = 'http://localhost:5000'

        db.session.commit()
        db.drop_all()
        db.create_all()

        self.t = threading.Thread(target=self.app.run)
        self.t.start()

        time.sleep(1)

        self.driver = webdriver.Chrome('/Users/titiloxx/Desktop/Cosas papa/chromedriver 2') 

    def test_title(self):
        driver = self.driver
        driver.get(self.baseURL)
        add_product_button = driver.find_element_by_xpath('/html/body/main/div[1]/div/button')
        add_product_button.click()
        modal = driver.find_element_by_id('modal')
        assert modal.is_displayed(), "El modal no esta visible"
    
    def test_modalEdit(self):
        driver = self.driver 
        driver.get(self.baseURL)
        nombreTabla=driver.find_element_by_xpath('//*[@id="orders"]/table/tbody/tr[1]/td[2]').text
        cantidadTabla=driver.find_element_by_xpath('//*[@id="orders"]/table/tbody/tr[1]/td[4]').text
        precioTotalTabla=driver.find_element_by_xpath('//*[@id="orders"]/table/tbody/tr[1]/td[5]').text
        edit_product_button = driver.find_element_by_xpath('//*[@id="orders"]/table/tbody/tr[1]/td[6]/button')
        edit_product_button.click()
     
        nombreModal = Select(driver.find_element_by_id('select-prod')).first_selected_option.text
        cantidadModal = driver.find_element_by_id('quantity').get_attribute('value')
        precioTotalModal= driver.find_element_by_id('total-price').text.replace("Precio total: $ ","")
        assert cantidadTabla==cantidadModal, "La cantidad no coincide"
        assert nombreTabla==nombreModal, "El nombre no coincide"
        assert precioTotalTabla==precioTotalModal, "El precio total no coincide"

    def tearDown(self):
        self.driver.get('http://localhost:5000/shutdown')

        db.session.remove()
        db.drop_all()
        self.driver.close()
        self.app_context.pop()

if __name__ == "__main__":
    unittest.main()

