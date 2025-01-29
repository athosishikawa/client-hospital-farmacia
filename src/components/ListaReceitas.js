import React, { useState, useEffect } from 'react';
import '../styles/ListaReceitasStyle.css';

const ListaReceitas = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch('http://localhost:8080/receita/listarReceitas');
        if (!response.ok) {
          throw new Error('Failed to fetch prescriptions');
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  if (loading) {
    return (
      <div className="prescription-container">
        <div className="loading-message">
          <p>Carregando receitas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="prescription-container">
        <div className="error-message">
          <p>Erro: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prescription-container">
      <div className="prescription-card">
        <div className="prescription-header">
          <h2>Receitas Médicas</h2>
        </div>
        
        <div className="prescription-content">
          {prescriptions.length === 0 ? (
            <p className="no-data">Nenhuma receita encontrada</p>
          ) : (
            <div className="table-wrapper">
              <table className="prescription-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Plano de Saúde</th>
                    <th>Medicamento</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription.id}>
                      <td>
                        {new Date(prescription.data).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="patient-info">
                          <p className="name">{prescription.paciente.pessoa.nome}</p>
                          <p className="details">CPF: {prescription.paciente.pessoa.cpf}</p>
                          <p className="details">
                            Nascimento: {new Date(prescription.paciente.pessoa.dataNascimento).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="doctor-info">
                          <p className="name">{prescription.medico.pessoa.nome}</p>
                          <p className="details">CRM: {prescription.medico.crm}</p>
                        </div>
                      </td>
                      <td>
                        {prescription.paciente.plano ? (
                          <span>{prescription.paciente.plano.nome}</span>
                        ) : (
                          <span className="no-plan">Particular</span>
                        )}
                      </td>
                      <td>
                        <div className="medication-item">
                          <p className="med-name">{prescription.medicamento.nome}</p>
                          <p className="med-details">Dosagem: {prescription.itemReceita.dosagem}</p>
                          <p className="med-details">Quantidade: {prescription.itemReceita.quantidade}</p>
                          <p className="med-details">Via: {prescription.itemReceita.viaDeAdministracao}</p>
                          {prescription.itemReceita.observacoes && (
                            <p className="med-obs">Obs: {prescription.itemReceita.observacoes}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListaReceitas;