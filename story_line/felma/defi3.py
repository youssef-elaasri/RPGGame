class Materiau:
    def __init__(self, nom, densite, conductivite_thermique, point_de_fusion):
        self.nom = nom
        self.densite = densite
        self.conductivite_thermique = conductivite_thermique
        self.point_de_fusion = point_de_fusion

    def point_comun(self, materiel1):
        return self.densite == materiel1.densite or \
               self.conductivite_thermique == materiel1.conductivite_thermique or \
               self.point_de_fusion == materiel1.point_de_fusion