import java.util.Comparator;

public class TriNom implements Comparator<Client> {
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
}
