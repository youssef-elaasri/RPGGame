

def distribution_energie(batiments,energie_restante):
    batiments_alumentes = []
    for batiment in batiments:
        if energie_restante >= batiment[0]:
            batiments_alumentes.append(batiment)
            energie_restante -= batiment[0]
    
    return batiments_alumentes
