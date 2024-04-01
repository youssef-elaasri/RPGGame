import unittest

class TestDefi4(unittest.TestCase):
    
    def test_add_new_friends(self):
            graph = {}
            result = add_friend(graph, "Alice", "Bob")
            self.assertEqual(result, {"Alice": ["Bob"], "Bob": ["Alice"]})

    def test_add_existing_friend(self):
        graph = {"Alice": ["Bob"], "Bob": ["Alice"]}
        result = add_friend(graph, "Alice", "Charlie")
        expected = {"Alice": ["Bob", "Charlie"], "Bob": ["Alice"], "Charlie": ["Alice"]}
        self.assertEqual(result, expected)

    def test_add_reciprocal_friend(self):
        graph = {"Alice": ["Bob", "Charlie"], "Bob": ["Alice"], "Charlie": ["Alice"]}
        result = add_friend(graph, "Bob", "Alice")
        self.assertEqual(result, graph)

    def test_add_new_person_with_existing_friend(self):
        graph = {"Alice": ["Bob", "Charlie"], "Bob": ["Alice"], "Charlie": ["Alice"]}
        result = add_friend(graph, "Diana", "Alice")
        expected = {"Alice": ["Bob", "Charlie", "Diana"], "Bob": ["Alice"], "Charlie": ["Alice"], "Diana": ["Alice"]}
        self.assertEqual(result, expected)


