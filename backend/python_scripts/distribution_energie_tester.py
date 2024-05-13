import unittest
from utils import tri_batiments
import random
from distribution_energie_suggested import distribution_energie
import timeout_decorator


def distribution_energie_solution(batiments,energie_restante):
    batiments_alumentes = []
    for batiment in batiments:
        if energie_restante >= batiment[0]:
            batiments_alumentes.append(batiment)
            energie_restante -= batiment[0]
    
    return batiments_alumentes


class TestDefi3(unittest.TestCase):

    @timeout_decorator.timeout(10)
    def test_distribution_energie(self):
        for _ in range(100):
            energie_restante = random.randint(0,1000)
            length = random.randint(1,100)
            batiments = []
            for _ in range(length):
                batiments.append((random.randint(1,100), random.randint(1,100)))
            batiments = tri_batiments(batiments)
            self.assertEqual(distribution_energie(batiments,energie_restante), distribution_energie_solution(batiments,energie_restante))


if __name__ == '__main__':
    unittest.main()