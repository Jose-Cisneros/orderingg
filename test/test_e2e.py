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

        self.driver = webdriver.Edge()
    '''
    def test_title(self):
        driver = self.driver
        driver.get(self.baseURL)
        add_product_button = driver.find_element_by_xpath('/html/body/main/div[1]/div/button')
        add_product_button.click()
        modal = driver.find_element_by_id('modal')
        assert modal.is_displayed(), "El modal no esta visible"
    
    '''
    def test_cantidades_negativas(self):
        driver = self.driver
        driver.get(self.baseURL)
        
        orden = Order(id= 1)
        db.session.add(orden)
       
        #Creo un producto
        prod = Product(id= 1, name= 'Tenedor', price= 50)
        db.session.add(prod)
        
        db.session.commit()
        
       
        driver.get(self.baseURL)
   
        add_product_button = driver.find_element_by_xpath('/html/body/main/div[1]/div/button')
        add_product_button.click()
       
        select = Select(driver.find_element_by_id('select-prod'))
        select.select_by_visible_text("Tenedor")
        quantity= driver.find_element_by_id('quantity')
        quantity.clear()
        quantity.send_keys("-1")
        time.sleep(3)
        save_button = driver.find_element_by_id('save-button')
       
       
        self.assertFalse(save_button.is_enabled(),"No deberia habilitarse el boton guardar con cantidad negativa")
    
    def tearDown(self):
        self.driver.get('http://localhost:5000/shutdown')

        db.session.remove()
        db.drop_all()
        self.driver.close()
        self.app_context.pop()

if __name__ == "__main__":
    unittest.main()

