import java.util.Objects;

public class Voiture {
    private int immariculation;
    private String marque;
    private float prixLocation;


    public Voiture(int immariculation, String marque, float prixLocation) {
        this.immariculation = immariculation;
        this.marque = marque;
        this.prixLocation = prixLocation;
    }

    public int getImmariculation() {
        return immariculation;
    }
    public void setImmariculation(int immariculation) {
        this.immariculation = immariculation;
    }
    public String getMarque() {
        return marque;
    }
    public void setMarque(String marque) {
        this.marque = marque;
    }
    public float getPrixLocation() {
        return prixLocation;
    }
    public void setPrixLocation(float prixLocation)
    { this.prixLocation = prixLocation;
    }


    @Override
    public int hashCode() {
        return Objects.hash(immariculation, marque, prixLocation);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Voiture voiture)) return false;
        return immariculation == voiture.immariculation && Float.compare(prixLocation, voiture.prixLocation) == 0 && Objects.equals(marque, voiture.marque);
    }

    @Override
    public String toString() {
        return "Voiture{" +
                "immariculation=" + immariculation +
                ", marque='" + marque + '\'' +
                ", prixLocation=" + prixLocation +
                '}';
    }
}