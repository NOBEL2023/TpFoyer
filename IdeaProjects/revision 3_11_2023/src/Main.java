import java.util.Map;

// Press Shift twice to open the Search Everywhere dialog and type `show whitespaces`,
// then press Enter. You can now see whitespace characters in your code.
public class Main {
    public static void main(String[] args) {
                try {

                    Agence agence1 = new Agence("telecom");


                    Voiture voiture1 = new Voiture(111 , "BMW", 200);
                    Voiture voiture2 = new Voiture(222 , "Fiat", 250);
                    Voiture voiture3 = new Voiture(333 , "Ford", 300);



                    agence1.ajoutVoiture(voiture1);
                    agence1.ajoutVoiture(voiture2);
                    agence1.ajoutVoiture(voiture3);


                    Client client1 = new Client(123 , "nour" , "belhedi");
                    Client client2 = new Client(456, "sabrine", "makri");



                    agence1.loueClientVoiture(client1, voiture1);
                    agence1.loueClientVoiture(client1, voiture2);
                    agence1.loueClientVoiture(client2, voiture3);


                    agence1.afficheLesClientsEtLeursListesVoitures();

                    System.out.println("tri code");

                    Map<Client, ListVoitures> clientsTriesParCode = agence1.triCodeCroissant();
                    System.out.println("triés par code croissant : " + clientsTriesParCode);

                    System.out.println("tri nom");

                    Map<Client, ListVoitures> clientsTriesParNom = agence1.triNomCroissant();
                    System.out.println(" triés par nom croissant : " + clientsTriesParNom);

                } catch (VoitureException e) {
                    System.out.println("Erreur : " + e.getMessage());
                }
            }
        }
