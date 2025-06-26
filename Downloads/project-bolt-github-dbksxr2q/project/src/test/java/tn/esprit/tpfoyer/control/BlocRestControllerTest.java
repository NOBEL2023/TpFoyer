package tn.esprit.tpfoyer.control;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import tn.esprit.tpfoyer.entity.Bloc;
import tn.esprit.tpfoyer.service.IBlocService;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BlocRestController.class)
class BlocRestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IBlocService blocService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetBlocs() throws Exception {
        // Given
        List<Bloc> blocs = Arrays.asList(bloc1, bloc2);
        when(blocService.retrieveAllBlocs()).thenReturn(blocs);

        // When & Then
        mockMvc.perform(get("/bloc/retrieve-all-blocs"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].nomBloc").value("Bloc A"))
                .andExpect(jsonPath("$[1].nomBloc").value("Bloc B"));
    }

    @Test
    void testRetrieveBloc() throws Exception {
        // Given
        when(blocService.retrieveBloc(1L)).thenReturn(bloc1);

        // When & Then
        mockMvc.perform(get("/bloc/retrieve-bloc/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nomBloc").value("Bloc A"))
                .andExpect(jsonPath("$.capaciteBloc").value(100));
    }

    @Test
    void testAddBloc() throws Exception {
        // Given
        when(blocService.addBloc(any(Bloc.class))).thenReturn(bloc1);

        // When & Then
        mockMvc.perform(post("/bloc/add-bloc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bloc1)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nomBloc").value("Bloc A"));
    }

    @Test
    void testModifyBloc() throws Exception {
        // Given
        bloc1.setNomBloc("Modified Bloc A");
        when(blocService.modifyBloc(any(Bloc.class))).thenReturn(bloc1);

        // When & Then
        mockMvc.perform(put("/bloc/modify-bloc")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(bloc1)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.nomBloc").value("Modified Bloc A"));
    }

    @Test
    void testRemoveBloc() throws Exception {
        // When & Then
        mockMvc.perform(delete("/bloc/remove-bloc/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBlocsWithoutFoyer() throws Exception {
        // Given
        List<Bloc> blocsWithoutFoyer = Arrays.asList(bloc1);
        when(blocService.trouverBlocsSansFoyer()).thenReturn(blocsWithoutFoyer);

        // When & Then
        mockMvc.perform(get("/bloc/trouver-blocs-sans-foyer"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nomBloc").value("Bloc A"));
    }
}