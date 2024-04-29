def chiffrement_cesar(texte, decalage):
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