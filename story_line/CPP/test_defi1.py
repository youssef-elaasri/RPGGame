import unittest
import random
import string

def chiffrement_cesar_solution(texte, decalage):
    resultat = ""
    for caractere in texte:
        if caractere.isalpha(): # Vérifier si c'est une lettre
            ascii_offset = 65 if caractere.isupper() else 97
            # Chiffrement et conversion en lettre
            caractere_chiffre = chr((ord(caractere) + decalage - ascii_offset) % 26 + ascii_offset)
            resultat += caractere_chiffre
        else:
            resultat += caractere
    return resultat


class TestDefi1(unittest.TestCase):

    def test_chiffrement_cesar(self):
        for _ in range(100):
            longueure = random.randint(1,100)
            texte = ''.join(random.choice(string.ascii_letters) for i in range(longueure))
            decalage = random.randint(1,26)
            self.assertEqual(chiffrement_cesar(texte,decalage),chiffrement_cesar_solution(texte,decalage))


if __name__ == '__main__':
    unittest.main()