import unittest
import utils
import random
from defi3 import Materiau


class TestDefi3(unittest.TestCase):
    def setUp(self):
        self.materiau_a = Materiau("Acier", 7.85, 50, 1510)
        self.materiau_b = Materiau("Aluminium", 2.7, 205, 660)
        self.materiau_c = Materiau("Acier", 7.85, 205, 1510)

    def test_point_comun_true(self):
        # Test où il y a au moins une propriété en commun (dans ce cas, plusieurs)
        self.assertTrue(self.materiau_a.point_comun(self.materiau_c))

    def test_point_comun_false(self):
        # Test où il n'y a aucune propriété en commun
        self.assertFalse(self.materiau_a.point_comun(self.materiau_b))

    def test_point_comun_densite(self):
        # Test spécifique pour la densité
        self.assertTrue(self.materiau_a.point_comun(Materiau("TestDensite", 7.85, 0, 0)))

    def test_point_comun_conductivite_thermique(self):
        # Test spécifique pour la conductivité thermique
        self.assertTrue(self.materiau_b.point_comun(Materiau("TestConductivite", 0, 205, 0)))

    def test_point_comun_point_de_fusion(self):
        # Test spécifique pour le point de fusion
        self.assertTrue(self.materiau_b.point_comun(Materiau("TestFusion", 0, 0, 660)))
    
    def test_random(self):
        for _ in range(100):
            densite1 = random.randint(0,10)
            conductivité1 = random.randint(0,300)
            fusion1 = random.randint(0,2000)

            densite2 = random.randint(0,10)
            conductivité2 = random.randint(0,300)
            fusion2 = random.randint(0,2000)

            materiau1_1 = Materiau("materiau1",densite1,conductivité1,fusion1)
            materiau1_2 = Materiau("materiau1",densite2,conductivité2,fusion2)

            materiau2_1 = utils.Materiau("materiau1",densite1,conductivité1,fusion1)
            materiau2_2 = utils.Materiau("materiau1",densite2,conductivité2,fusion2)

            self.assertEqual(materiau1_1.point_comun(materiau1_2),materiau2_1.point_comun(materiau2_2))
    def test_nom(self):
        self.assertEqual(self.materiau_a.nom, "Acier")



if __name__ == '__main__':
    unittest.main()