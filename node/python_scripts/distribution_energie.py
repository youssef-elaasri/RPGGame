def distribution_energie(batiments, energie_restante):
    """
    Distributes the available energy among the sorted list of buildings.

    Parameters:
    batiments (list of tuples): Sorted list of buildings (energy_consumption, importance).
    energie_restante (int): Total available energy left.

    Returns:
    list: List of buildings that were powered.
    """