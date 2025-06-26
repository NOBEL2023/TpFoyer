package tn.esprit.tpfoyer.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.tpfoyer.entity.Chambre;
import tn.esprit.tpfoyer.entity.TypeChambre;
import tn.esprit.tpfoyer.repository.ChambreRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChambreServiceImplTest {

    @Mock
    private ChambreRepository chambreRepository;

    @InjectMocks
    private ChambreServiceImpl chambreService;

    private Chambre chambre1;
    private Chambre chambre2;

    @BeforeEach
    void setUp() {
        chambre1 = new Chambre();
        chambre1.setIdChambre(1L);
        chambre1.setNumeroChambre(101L);
        chambre1.setTypeC(TypeChambre.SIMPLE);

        chambre2 = new Chambre();
        chambre2.setIdChambre(2L);
        chambre2.setNumeroChambre(102L);
        chambre2.setTypeC(TypeChambre.DOUBLE);
    }

    @Test
    void testRetrieveAllChambres() {
        // Given
        List<Chambre> expectedChambres = Arrays.asList(chambre1, chambre2);
        when(chambreRepository.findAll()).thenReturn(expectedChambres);

        // When
        List<Chambre> actualChambres = chambreService.retrieveAllChambres();

        // Then
        assertEquals(2, actualChambres.size());
        assertEquals(expectedChambres, actualChambres);
        verify(chambreRepository, times(1)).findAll();
    }

    @Test
    void testRetrieveChambre() {
        // Given
        when(chambreRepository.findById(1L)).thenReturn(Optional.of(chambre1));

        // When
        Chambre actualChambre = chambreService.retrieveChambre(1L);

        // Then
        assertNotNull(actualChambre);
        assertEquals(chambre1.getIdChambre(), actualChambre.getIdChambre());
        assertEquals(chambre1.getNumeroChambre(), actualChambre.getNumeroChambre());
        verify(chambreRepository, times(1)).findById(1L);
    }

    @Test
    void testAddChambre() {
        // Given
        when(chambreRepository.save(any(Chambre.class))).thenReturn(chambre1);

        // When
        Chambre savedChambre = chambreService.addChambre(chambre1);

        // Then
        assertNotNull(savedChambre);
        assertEquals(chambre1.getNumeroChambre(), savedChambre.getNumeroChambre());
        verify(chambreRepository, times(1)).save(chambre1);
    }

    @Test
    void testModifyChambre() {
        // Given
        chambre1.setNumeroChambre(201L);
        when(chambreRepository.save(any(Chambre.class))).thenReturn(chambre1);

        // When
        Chambre modifiedChambre = chambreService.modifyChambre(chambre1);

        // Then
        assertNotNull(modifiedChambre);
        assertEquals(201L, modifiedChambre.getNumeroChambre());
        verify(chambreRepository, times(1)).save(chambre1);
    }

    @Test
    void testRemoveChambre() {
        // Given
        doNothing().when(chambreRepository).deleteById(anyLong());

        // When
        chambreService.removeChambre(1L);

        // Then
        verify(chambreRepository, times(1)).deleteById(1L);
    }

    @Test
    void testRecupererChambresSelonTyp() {
        // Given
        List<Chambre> chambresSimples = Arrays.asList(chambre1);
        when(chambreRepository.findAllByTypeC(TypeChambre.SIMPLE)).thenReturn(chambresSimples);

        // When
        List<Chambre> actualChambres = chambreService.recupererChambresSelonTyp(TypeChambre.SIMPLE);

        // Then
        assertEquals(1, actualChambres.size());
        assertEquals(TypeChambre.SIMPLE, actualChambres.get(0).getTypeC());
        verify(chambreRepository, times(1)).findAllByTypeC(TypeChambre.SIMPLE);
    }

    @Test
    void testTrouverchambreSelonEtudiant() {
        // Given
        long cin = 12345678L;
        when(chambreRepository.trouverChselonEt(cin)).thenReturn(chambre1);

        // When
        Chambre actualChambre = chambreService.trouverchambreSelonEtudiant(cin);

        // Then
        assertNotNull(actualChambre);
        assertEquals(chambre1.getIdChambre(), actualChambre.getIdChambre());
        verify(chambreRepository, times(1)).trouverChselonEt(cin);
    }
}