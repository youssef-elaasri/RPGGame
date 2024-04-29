
import unittest
import random
from tri_batiments_suggested import tri_batiments


def tri_batiments_solution(batiments):
    return sorted(batiments, key = lambda batiment: batiment[1]/batiment[0], reverse= True)


class TestDefi2(unittest.TestCase):

    def test_tri_batiments(self):
        for _ in range(100):
            length = random.randint(1,100)
            batiments = []
            for _ in range(length):
                batiments.append((random.randint(1,100), random.randint(1,100)))
            self.assertEqual(tri_batiments(batiments), tri_batiments_solution(batiments))
        

if __name__ == '__main__':
    unittest.main()