import React, { useState, useEffect } from 'react';
import "../styles/CadastroReceitaStyle.css"
import axios from 'axios';


const CadastroReceita = () => {
    const [medicamentos, setMedicamentos] = useState([]);
    const [planosSaude, setPlanosSaude] = useState([]);
    const [selectedMedicamento, setSelectedMedicamento] = useState(null);
    const [formData, setFormData] = useState({
        paciente: {
            nome: '',
            dataNascimento: '',
            cpf: '',
            planoSaude: ''
        },
        medico: {
            nome: '',
            crm: '',
            assinaturaDigital: null
        },
        medicamento: {
            id: '',
            nome: '',
            dosagem: '',
            quantidade: '',
            viaAdministracao: '',
            observacoes: ''
        }
    });

    const carregarMedicamentos = async () => {
        try {
            const response = await fetch('http://localhost:8080/medicamento/listarMedicamentos');
            if (response.ok) {
                const data = await response.json();
                setMedicamentos(data);
            } else {
                console.error('Erro ao carregar medicamentos');
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
        }
    };

    const carregarPlanosSaude = async () => {
        try {
            const response = await fetch('http://localhost:8080/plano/listarPlanos');
            if (response.ok) {
                const data = await response.json();
                setPlanosSaude(data);
            } else {
                console.error('Erro ao carregar planos de saúde');
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
        }
    };


    useEffect(() => {
        carregarMedicamentos();
        carregarPlanosSaude();

    }, []);

    const handleMedicamentoSelect = (e) => {
        const medicamentoId = e.target.value;
        const medicamentoSelecionado = medicamentos.find(med => med.id === parseInt(medicamentoId));
        
        if (medicamentoSelecionado) {
            setSelectedMedicamento(medicamentoSelecionado);
            setFormData(prev => ({
                ...prev,
                medicamento: {
                    id: medicamentoSelecionado.id,
                    nome: medicamentoSelecionado.nome,
                    dosagem: medicamentoSelecionado.dosagem,
                    quantidade: medicamentoSelecionado.quantidade,
                    viaAdministracao: medicamentoSelecionado.viaDeAdministracao,
                    observacoes: medicamentoSelecionado.observacoes
                }
            }));
        }
    };

    const handleInputChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [name]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // 1. First, create the Pessoa record for the patient
            const pessoaData = {
                nome: formData.paciente.nome,
                cpf: formData.paciente.cpf,
                dataNascimento: formData.paciente.dataNascimento,
                // Add other required Pessoa fields
            };
            
            const pessoaResponse = await axios.post('http://localhost:8080/pessoa/cadastrarPessoa', pessoaData);
            console.log(pessoaData)

            if (!pessoaResponse.data) {
                throw new Error('Failed to create Pessoa record');
            }

            // 2. Create the Paciente record
            const pessoaCriada = pessoaResponse.data;
            console.log('Pessoa criada:', pessoaCriada);

            // 2. Criar Paciente
            const pacienteData = {
                plano: formData.paciente.planoSaude,
                pessoa: pessoaCriada
            };
            
            const pacienteResponse = await axios.post('http://localhost:8080/paciente/cadastrarPacientes', pacienteData);
            console.log(pacienteData)

            if (!pacienteResponse.data) {
                throw new Error('Failed to create Paciente record');
            }

            // 3. Fetch the Medico record using CRM
            const medicoResponse = await axios.get(`http://localhost:8080/medicos/findMedico?crm=${formData.medico.crm}`);
        

            if (!medicoResponse.data) {
                throw new Error('Failed to fetch Medico record');
            }

            // 4. Create ItemReceita with medicamento details
            const itemReceitaData = {
                medicamento: {
                    id: formData.medicamento.id
                },
                quantidade: formData.medicamento.quantidade,
                dosagem: formData.medicamento.dosagem,
                observacoes: formData.medicamento.observacoes
            };

            // 5. Finally, create the Receita
            const receitaData = {
                data: new Date(),
                medicamento: formData.medicamento,
                medico: medicoResponse.data,
                paciente: pacienteResponse.data,
                itemReceita: itemReceitaData
            };

            const receitaResponse = await axios.post('http://localhost:8080/receita/cadastrarReceita', receitaData);
            console.log(receitaData)
            
            if (receitaResponse.data) {
                alert('Receita cadastrada com sucesso!');
                // Reset form or redirect
            } else {
                throw new Error('Failed to create Receita');
            }

        } catch (error) {
            console.error('Erro ao processar cadastro:', error);
            alert(`Erro ao cadastrar receita: ${error.message}`);
        }
    };

    return(
        <div className="prescription-form-container">
            <form className="prescription-form">
                <h2>Criar Receita Eletrônica</h2>

                    <fieldset>
                        <legend>Dados do Paciente</legend>
                        <div className="form-group">
                            <label for="patient-name">Nome Completo:</label>
                            <input type="text" id="patient-name" name="nome" placeholder="Digite o nome do paciente" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label for="birth-date">Data de Nascimento:</label>
                            <input type="date" id="birth-date" name="dataNascimento" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label for="cpf">CPF:</label>
                            <input type="text" id="cpf" name="cpf" placeholder="Digite o CPF" onChange={(e) => handleInputChange(e, 'paciente')} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="health-plan">Plano de Saúde:</label>
                            <select id="health-plan" name="planoSaude" onChange={(e) => handleInputChange(e, 'paciente')} required>
                                <option value="">Selecione um plano de saúde</option>
                                {planosSaude.map(plano => (
                                    <option key={plano.id} value={plano.nome}>{plano.nome}</option>
                                ))}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados do Médico</legend>
                        <div className="form-group">
                            <label for="doctor-name">Nome Completo:</label>
                            <input type="text" id="doctor-name" name="nome" placeholder="Digite o nome do médico" onChange={(e) => handleInputChange(e, 'medico')} required />
                        </div>
                        <div className="form-group">
                            <label for="crm">CRM:</label>
                            <input type="text" id="crm" name="crm" placeholder="Digite o CRM" onChange={(e) => handleInputChange(e, 'medico')} required />
                        </div>
                        <div className="form-group">
                            <label for="digital-signature">Assinatura Digital:</label>
                            <input type="file" id="digital-signature" name="assinaturaDigital" onChange={(e) => handleInputChange(e, 'medico')} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Dados dos Medicamentos</legend>
                        <div className="form-group">
                            <label htmlFor="medication-select">Selecione o Medicamento:</label>
                            <select
                                id="medication-select"
                                className="form-control"
                                onChange={handleMedicamentoSelect}
                                required
                            >
                                <option value="">Selecione um medicamento</option>
                                {medicamentos.map(med => (
                                    <option key={med.id} value={med.id}>
                                        {med.nome} (mg)
                                    </option>
                                ))}
                            </select>
                        </div>
                    
                        {selectedMedicamento && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="dosage">Dosagem:</label>
                                    <input
                                        type="text"
                                        id="dosage"
                                        name="dosagen"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantidade:</label>
                                    <input
                                        type="text"
                                        id="quantity"
                                        name="quantidade"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="administration-route">Via de Administração:</label>
                                    <input
                                        type="text"
                                        id="administration-route"
                                        name="viaAdministracao"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="observations">Observações:</label>
                                    <textarea
                                        id="observations"
                                        name="observacoes"
                                        onChange={(e) => handleInputChange(e, 'medicamento')}
                                        rows="4"
                                    />
                                </div>
                            </>
                        )}
                    </fieldset>

                    <button type="submit" className="btn" onClick={handleSubmit}>Salvar Receita</button>
                </form>
            </div>

    );

};

export default CadastroReceita;