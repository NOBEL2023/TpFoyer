package tn.esprit.tpfoyer.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tn.esprit.tpfoyer.entity.Bloc;

import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BlocServiceIntegrationTest {

    @Autowired
    private IBlocService blocService;

    @Test
    void contextLoads() {
        // Basic sanity test to check if the Spring context loads and bean is injected
        assertNotNull(blocService);
    }

    @Test
    void testRetrieveAllBlocs() {
        List<Bloc> blocs = blocService.retrieveAllBlocs();
        assertNotNull(blocs);
        // You can add more assertions depending on your DB state or setup
    }

    @Test
    void testAddAndRemoveBloc() {
        // Given
        Bloc bloc = new Bloc();
        bloc.setNomBloc("Test Bloc");
        bloc.setCapaciteBloc(99L);

        // When: add bloc
        Bloc savedBloc = blocService.addBloc(bloc);

        // Then: verify bloc was added
        assertNotNull(savedBloc.getIdBloc());
        Bloc retrievedBloc = blocService.retrieveBloc(savedBloc.getIdBloc());
        assertEquals("Test Bloc", retrievedBloc.getNomBloc());

        // Cleanup
        blocService.removeBloc(savedBloc.getIdBloc());
        assertThrows(NoSuchElementException.class, () -> blocService.retrieveBloc(savedBloc.getIdBloc()));
    }

}
