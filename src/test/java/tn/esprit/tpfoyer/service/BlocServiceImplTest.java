package tn.esprit.tpfoyer.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tn.esprit.tpfoyer.entity.Bloc;
import tn.esprit.tpfoyer.repository.BlocRepository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BlocServiceImplTest {

    @Mock
    private BlocRepository blocRepository;

    @InjectMocks
    private BlocServiceImpl blocService;

    private Bloc bloc1;
    private Bloc bloc2;

    @BeforeEach
    void setUp() {
        bloc1 = new Bloc();
        bloc1.setIdBloc(1L);
        bloc1.setNomBloc("Bloc A");
        bloc1.setCapaciteBloc(100L);

        bloc2 = new Bloc();
        bloc2.setIdBloc(2L);
        bloc2.setNomBloc("Bloc B");
        bloc2.setCapaciteBloc(150L);
    }

    @Test
    void testRetrieveAllBlocs() {
        // Given
        List<Bloc> expectedBlocs = Arrays.asList(bloc1, bloc2);
        when(blocRepository.findAll()).thenReturn(expectedBlocs);

        // When
        List<Bloc> actualBlocs = blocService.retrieveAllBlocs();

        // Then
        assertEquals(2, actualBlocs.size());
        assertEquals(expectedBlocs, actualBlocs);
        verify(blocRepository, times(1)).findAll();
    }

    @Test
    void testRetrieveBloc() {
        // Given
        when(blocRepository.findById(1L)).thenReturn(Optional.of(bloc1));

        // When
        Bloc actualBloc = blocService.retrieveBloc(1L);

        // Then
        assertNotNull(actualBloc);
        assertEquals(bloc1.getIdBloc(), actualBloc.getIdBloc());
        assertEquals(bloc1.getNomBloc(), actualBloc.getNomBloc());
        verify(blocRepository, times(1)).findById(1L);
    }

    @Test
    void testAddBloc() {
        // Given
        when(blocRepository.save(any(Bloc.class))).thenReturn(bloc1);

        // When
        Bloc savedBloc = blocService.addBloc(bloc1);

        // Then
        assertNotNull(savedBloc);
        assertEquals(bloc1.getNomBloc(), savedBloc.getNomBloc());
        verify(blocRepository, times(1)).save(bloc1);
    }

    @Test
    void testModifyBloc() {
        // Given
        bloc1.setNomBloc("Modified Bloc A");
        when(blocRepository.save(any(Bloc.class))).thenReturn(bloc1);

        // When
        Bloc modifiedBloc = blocService.modifyBloc(bloc1);

        // Then
        assertNotNull(modifiedBloc);
        assertEquals("Modified Bloc A", modifiedBloc.getNomBloc());
        verify(blocRepository, times(1)).save(bloc1);
    }

    @Test
    void testRemoveBloc() {
        // Given
        doNothing().when(blocRepository).deleteById(anyLong());

        // When
        blocService.removeBloc(1L);

        // Then
        verify(blocRepository, times(1)).deleteById(1L);
    }

    @Test
    void testTrouverBlocsSansFoyer() {
        // Given
        List<Bloc> blocsWithoutFoyer = Arrays.asList(bloc1, bloc2);
        when(blocRepository.findAllByFoyerIsNull()).thenReturn(blocsWithoutFoyer);

        // When
        List<Bloc> actualBlocs = blocService.trouverBlocsSansFoyer();

        // Then
        assertEquals(2, actualBlocs.size());
        assertEquals(blocsWithoutFoyer, actualBlocs);
        verify(blocRepository, times(1)).findAllByFoyerIsNull();
    }

    @Test
    void testTrouverBlocsParNomEtCap() {
        // Given
        String nomBloc = "Bloc A";
        long capacite = 100L;
        List<Bloc> expectedBlocs = Arrays.asList(bloc1);
        when(blocRepository.findAllByNomBlocAndCapaciteBloc(nomBloc, capacite)).thenReturn(expectedBlocs);

        // When
        List<Bloc> actualBlocs = blocService.trouverBlocsParNomEtCap(nomBloc, capacite);

        // Then
        assertEquals(1, actualBlocs.size());
        assertEquals(expectedBlocs, actualBlocs);
        verify(blocRepository, times(1)).findAllByNomBlocAndCapaciteBloc(nomBloc, capacite);
    }
}