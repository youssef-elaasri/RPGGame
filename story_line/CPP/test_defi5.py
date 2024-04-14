import unittest

class TestDefi4(unittest.TestCase):
    def setUp(self):
        # Création d'un graphe de test
        self.graphe = {
            "Alice": ["Bob", "Charlie"],
            "Bob": ["Alice", "Diane"],
            "Charlie": ["Alice", "Eve"],
            "Diane": ["Bob"],
            "Eve": ["Charlie"]
        }

    def test_find_friends(self):
        # Test pour vérifier la liste des amis d'Alice
        expected_friends_of_alice = ["Bob", "Charlie"]
        actual_friends_of_alice = find_friends(self.graphe, "Alice")
        self.assertListEqual(expected_friends_of_alice, actual_friends_of_alice, "La liste des amis d'Alice devrait être ['Bob', 'Charlie']")

        # Test pour un utilisateur sans amis (non présent dans le graphe)
        self.assertEqual(find_friends(self.graphe, "Zoe"), [], "La liste des amis de Zoe devrait être vide")

if __name__ == '__main__':
    unittest.main()
