import unittest
import random
import string

def decrypter_par_substitution_solution(message_crypte, frequences_lettres = 'etaoinsrhldcumfpgwybvkxjqz'):
    # Fréquences des lettres en anglais dans l'ordre décroissant
    frequences_lettres = 'etaoinsrhldcumfpgwybvkxjqz'
    
    # Calculer la fréquence des lettres dans le message crypté
    from collections import Counter
    compteur = Counter([lettre for lettre in message_crypte.lower() if lettre.isalpha()])
    lettres_triees_par_freq = ''.join([lettre for lettre, _ in compteur.most_common()])
    
    # Associer les lettres du message crypté aux lettres en anglais par fréquence
    mapping = str.maketrans(lettres_triees_par_freq, frequences_lettres)
    
    # Décrypter le message
    message_decrypte = message_crypte.translate(mapping)
    
    return message_decrypte


class TestDefi1(unittest.TestCase):

    def test_chiffrement_cesar(self):
        for _ in range(100):
            longueure = random.randint(1,100)
            texte = ''.join(random.choice(string.ascii_letters) for i in range(longueure))
            texte += "etaoinsrhldcumfpgwybvkxjqz"
            self.assertEqual(decrypter_par_substitution(texte,'etaoinsrhldcumfpgwybvkxjqz'),decrypter_par_substitution_solution(texte))


if __name__ == '__main__':
    unittest.main()