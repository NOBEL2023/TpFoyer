import java.util.*;

public class Agence {
    private String nom;
    private ListVoitures vs;
    private Map<Client, ListVoitures> ClientVoitureLoue;

    public Agence(String nom) {
        this.nom = nom;
        this.vs = new ListVoitures();
        this.ClientVoitureLoue = new HashMap<>();
    }

    public void ajoutVoiture(Voiture v) throws VoitureException {
        vs.ajoutVoiture(v);
    }

    public void suppVoiture(Voiture v) throws VoitureException {
        vs.supprimeVoiture(v);
        for (ListVoitures voituresLouees : ClientVoitureLoue.values()) {
            voituresLouees.supprimeVoiture(v);
        }
    }

    public void loueClientVoiture(Client cl, Voiture v) throws VoitureException {
        if (!ClientVoitureLoue.containsKey(cl)) {
            ClientVoitureLoue.put(cl, new ListVoitures());
        }
        ListVoitures voituresLouees = ClientVoitureLoue.get(cl);
        voituresLouees.ajoutVoiture(v);
    }

    public void retourClientVoiture(Client cl, Voiture v) throws VoitureException {
        if (ClientVoitureLoue.containsKey(cl)) {
            ListVoitures voituresLouees = ClientVoitureLoue.get(cl);
            voituresLouees.supprimeVoiture(v);
        }
    }

    public List<Voiture> selectVoitureSelonCritere(Critere c) {
        List<Voiture> voituresSatisfaisantCritere = new ArrayList<>();
        for (Voiture v : vs.getVoitures()) {
            if (c.estSatisfaitPar(v)) {
                voituresSatisfaisantCritere.add(v);
            }
        }
        return voituresSatisfaisantCritere;
    }

    public Set<Client> ensembleClientsLoueurs() {
        return ClientVoitureLoue.keySet();
    }

    public Collection<ListVoitures> collectionVoituresLouees() {
        return ClientVoitureLoue.values();
    }

    public void afficheLesClientsEtLeursListesVoitures() {
        for (Map.Entry<Client, ListVoitures> entry : ClientVoitureLoue.entrySet()) {
            Client client = entry.getKey();
            ListVoitures voituresLouees = entry.getValue();
            System.out.println("Client: " + client.getNom() + ", Voitures louées: ");
            voituresLouees.affiche();
        }
    }

    public Map<Client, ListVoitures> triCodeCroissant() {
        Map<Client, ListVoitures> triee = new TreeMap<>(new Comparator<Client>() {
            @Override
            public int compare(Client client1, Client client2) {
                int code1 = client1.getCode();
                int code2 = client2.getCode();

                if (code1 < code2) {
                    return -1;
                } else if (code1 > code2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
        triee.putAll(ClientVoitureLoue);
        return triee;
    }


    public Map<Client, ListVoitures> triNomCroissant() {
        Map<Client, ListVoitures> triee = new TreeMap<>(new Comparator<Client>() {
            @Override
            public int compare(Client client1, Client client2) {
                return client1.getNom().compareTo(client2.getNom());
            }
        });
        triee.putAll(ClientVoitureLoue);
        return triee;
    }


}

