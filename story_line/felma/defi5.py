def decrypter_par_substitution(message_crypte,frequences_lettres):
    
    # Calculer la fréquence des lettres dans le message crypté
    from collections import Counter
    compteur = Counter([lettre for lettre in message_crypte.lower() if lettre.isalpha()])
    lettres_triees_par_freq = ''.join([lettre for lettre, _ in compteur.most_common()])
    
    # Associer les lettres du message crypté aux lettres en anglais par fréquence
    mapping = str.maketrans(lettres_triees_par_freq, frequences_lettres)
    
    # Décrypter le message
    message_decrypte = message_crypte.translate(mapping)
    
    return message_decrypte