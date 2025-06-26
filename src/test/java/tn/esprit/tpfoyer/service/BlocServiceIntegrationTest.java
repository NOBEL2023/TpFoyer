package tn.esprit.tpfoyer.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import tn.esprit.tpfoyer.entity.Bloc;

import java.util.List;

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
        Bloc newBloc = new Bloc();
        newBloc.setNomBloc("Test Bloc");
        newBloc.setCapaciteBloc(50L);

        // Add Bloc
        Bloc savedBloc = blocService.addBloc(newBloc);
        assertNotNull(savedBloc.getIdBloc());
        assertEquals("Test Bloc", savedBloc.getNomBloc());

        // Remove Bloc
        blocService.removeBloc(savedBloc.getIdBloc());

        // Verify it's removed
        Bloc deletedBloc = blocService.retrieveBloc(savedBloc.getIdBloc());
        assertNull(deletedBloc);
    }
}
