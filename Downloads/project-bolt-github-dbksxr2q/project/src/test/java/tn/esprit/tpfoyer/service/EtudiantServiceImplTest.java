package tn.esprit.tpfoyer.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.tpfoyer.entity.Etudiant;
import tn.esprit.tpfoyer.repository.EtudiantRepository;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EtudiantServiceImplTest {

    @Mock
    private EtudiantRepository etudiantRepository;

    @InjectMocks
    private EtudiantServiceImpl etudiantService;

    private Etudiant etudiant1;
    private Etudiant etudiant2;

    @BeforeEach
    void setUp() {
        etudiant1 = new Etudiant();
        etudiant1.setIdEtudiant(1L);
        etudiant1.setNomEtudiant("Dupont");
        etudiant1.setPrenomEtudiant("Jean");
        etudiant1.setCinEtudiant(12345678L);
        etudiant1.setDateNaissance(new Date());

        etudiant2 = new Etudiant();
        etudiant2.setIdEtudiant(2L);
        etudiant2.setNomEtudiant("Martin");
        etudiant2.setPrenomEtudiant("Marie");
        etudiant2.setCinEtudiant(87654321L);
        etudiant2.setDateNaissance(new Date());
    }

    @Test
    void testRetrieveAllEtudiants() {
        // Given
        List<Etudiant> expectedEtudiants = Arrays.asList(etudiant1, etudiant2);
        when(etudiantRepository.findAll()).thenReturn(expectedEtudiants);

        // When
        List<Etudiant> actualEtudiants = etudiantService.retrieveAllEtudiants();

        // Then
        assertEquals(2, actualEtudiants.size());
        assertEquals(expectedEtudiants, actualEtudiants);
        verify(etudiantRepository, times(1)).findAll();
    }

    @Test
    void testRetrieveEtudiant() {
        // Given
        when(etudiantRepository.findById(1L)).thenReturn(Optional.of(etudiant1));

        // When
        Etudiant actualEtudiant = etudiantService.retrieveEtudiant(1L);

        // Then
        assertNotNull(actualEtudiant);
        assertEquals(etudiant1.getIdEtudiant(), actualEtudiant.getIdEtudiant());
        assertEquals(etudiant1.getNomEtudiant(), actualEtudiant.getNomEtudiant());
        verify(etudiantRepository, times(1)).findById(1L);
    }

    @Test
    void testAddEtudiant() {
        // Given
        when(etudiantRepository.save(any(Etudiant.class))).thenReturn(etudiant1);

        // When
        Etudiant savedEtudiant = etudiantService.addEtudiant(etudiant1);

        // Then
        assertNotNull(savedEtudiant);
        assertEquals(etudiant1.getNomEtudiant(), savedEtudiant.getNomEtudiant());
        verify(etudiantRepository, times(1)).save(etudiant1);
    }

    @Test
    void testModifyEtudiant() {
        // Given
        etudiant1.setNomEtudiant("Durand");
        when(etudiantRepository.save(any(Etudiant.class))).thenReturn(etudiant1);

        // When
        Etudiant modifiedEtudiant = etudiantService.modifyEtudiant(etudiant1);

        // Then
        assertNotNull(modifiedEtudiant);
        assertEquals("Durand", modifiedEtudiant.getNomEtudiant());
        verify(etudiantRepository, times(1)).save(etudiant1);
    }

    @Test
    void testRemoveEtudiant() {
        // Given
        doNothing().when(etudiantRepository).deleteById(anyLong());

        // When
        etudiantService.removeEtudiant(1L);

        // Then
        verify(etudiantRepository, times(1)).deleteById(1L);
    }

    @Test
    void testRecupererEtudiantParCin() {
        // Given
        long cin = 12345678L;
        when(etudiantRepository.findEtudiantByCinEtudiant(cin)).thenReturn(etudiant1);

        // When
        Etudiant actualEtudiant = etudiantService.recupererEtudiantParCin(cin);

        // Then
        assertNotNull(actualEtudiant);
        assertEquals(etudiant1.getCinEtudiant(), actualEtudiant.getCinEtudiant());
        verify(etudiantRepository, times(1)).findEtudiantByCinEtudiant(cin);
    }
}