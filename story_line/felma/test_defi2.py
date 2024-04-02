import unittest

class Testdefi2(unittest.TestCase):
    def setUp(self):
        self.graphe = {
            "DepartementA": (["DepartementB", "DepartementC"], ["DepartementD"]),
            "DepartementB": (["DepartementA", "DepartementC"], []),
            "DepartementC": (["DepartementA", "DepartementB", "DepartementD"], []),
            "DepartementD": (["DepartementC"], ["DepartementA"]), 
        }

    def test_chemin_avec_lien_defectueux(self):
        self.assertEqual(chemin(self.graphe, "DepartementA", "DepartementD"), ["DepartementA", "DepartementC", "DepartementD"])

    def test_chemin_inexistant(self):
        self.assertIsNone(chemin(self.graphe, "DepartementA", "DepartementE"))

    def test_chemin_existe(self):
        self.assertNotEqual(chemin(self.graphe, "DepartementA", "DepartementB"), ["DepartementA", "DepartementB"])

if __name__ == '__main__':
    unittest.main()