def tri_batiments(batiments):
    return sorted(batiments, key = lambda batiment: batiment[1]/batiment[0], reverse= True)