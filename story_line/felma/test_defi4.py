import unittest
from utils import Materiau

class TestTrouverMateriauInconnu(unittest.TestCase):
    def setUp(self):
        # Initialiser quelques matériaux à tester
        self.materiel_a = Materiau("Acier", 7.85, 50, 1510)
        self.materiel_b = Materiau("Aluminium", 2.7, 205, 660)
        self.materiel_c = Materiau("Cuivre", 8.96, 401, 1085)
        self.materiel_inconnu = Materiau("Inconnu", 1.0, 1.0, 1)

    def test_trouver_materiau_inconnu(self):
        # Créer une liste de matériaux incluant le matériau inconnu
        materiaux = [self.materiel_a, self.materiel_b, self.materiel_c, self.materiel_inconnu]
        # Vérifier si la fonction identifie correctement le matériau inconnu
        result = trouver_materiau_inconnu(materiaux)
        self.assertEqual(result, self.materiel_inconnu, "Le matériau inconnu n'a pas été correctement identifié")

if __name__ == '__main__':
    unittest.main()
