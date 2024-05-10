def chiffrement_cesar(texte, decalage):
    """
    This function encrypts the given text using the Caesar cipher.
    
    Parameters:
    texte (str): The text to be encrypted.
    decalage (int): The number of positions each letter should be shifted.

    Returns:
    str: The encrypted text.
    """
    
    # Initialize the result string
    resultat = ""