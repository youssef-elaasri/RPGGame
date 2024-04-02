import unittest

class TestDefi1(unittest.TestCase):
    def test_liens_defectueux_simples(self):
        graphe_test = {
            "DepartementA": ([], ["DepartementB"]),
            "DepartementB": ([], ["DepartementA", "DepartementC"]),
            "DepartementC": ([], ["DepartementB"]),
        }
        resultats_attendus = [("DepartementB", "DepartementA"), ("DepartementA", "DepartementB"),
                              ("DepartementB", "DepartementC"), ("DepartementC", "DepartementB")]
        self.assertEqual(sorted(identifier_liens_defectueux(graphe_test)), sorted(resultats_attendus))
    
    def test_aucun_lien_defectueux(self):
        graphe_test = {
            "DepartementA": (["DepartementB", "DepartementC"], []),
            "DepartementB": (["DepartementA", "DepartementC"], []),
            "DepartementC": (["DepartementA", "DepartementB"], []),
        }
        resultats_attendus = []
        self.assertEqual(identifier_liens_defectueux(graphe_test), resultats_attendus)
    
    def test_tous_les_liens_defectueux(self):
        graphe_test = {
            "DepartementA": ([], ["DepartementB", "DepartementC"]),
            "DepartementB": ([], ["DepartementA", "DepartementC"]),
            "DepartementC": ([], ["DepartementA", "DepartementB"]),
        }
        resultats_attendus = [("DepartementA", "DepartementB"), ("DepartementB", "DepartementA"),
                              ("DepartementA", "DepartementC"), ("DepartementC", "DepartementA"),
                              ("DepartementB", "DepartementC"), ("DepartementC", "DepartementB")]
        self.assertEqual(sorted(identifier_liens_defectueux(graphe_test)), sorted(resultats_attendus))

if __name__ == '__main__':
    unittest.main()
