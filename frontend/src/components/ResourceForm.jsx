import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';

const NUMBER_FIELDS = ['precoCompra', 'precoVenda', 'estoqueMinimo', 'estoqueAtual', 'valor', 'quantidade'];
const SELECT_FIELDS = {
  role: ['ADMIN', 'GERENTE', 'VENDEDOR', 'ESTOQUISTA', 'FINANCEIRO']
};

function fieldType(name) {
  if (name === 'senha') return 'password';
  if (name === 'email') return 'email';
  if (NUMBER_FIELDS.includes(name)) return 'number';
  return 'text';
}

function toLabel(name) {
  return name.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

export function ResourceForm({ fields, onSubmit, onCancel, loading, editRecord }) {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm();

  useEffect(() => {
    if (editRecord) {
      // preenche apenas os campos do formulário, ignora senha
      const values = {};
      fields.forEach((f) => {
        if (f !== 'senha') values[f] = editRecord[f] ?? '';
      });
      reset(values);
    } else {
      reset({});
    }
  }, [editRecord, fields, reset]);

  async function submit(values) {
    NUMBER_FIELDS.forEach((f) => { if (values[f] !== undefined && values[f] !== '') values[f] = Number(values[f]); });
    // remove senha vazia no modo edição
    if (editRecord && values.senha === '') delete values.senha;
    try {
      await onSubmit(values);
      reset({});
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || 'Erro ao salvar.';
      setError('root', { message: msg });
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit(submit)}>
      {fields.map((field) => (
        <label key={field}>
          <span className="field-label">
            {toLabel(field)}
            {field === 'senha' && editRecord ? ' (deixe vazio para manter)' : ''}
          </span>
          {SELECT_FIELDS[field] ? (
            <select className="field-select" {...register(field)}>
              {SELECT_FIELDS[field].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              className="field-input"
              type={fieldType(field)}
              step={NUMBER_FIELDS.includes(field) ? 'any' : undefined}
              {...register(field)}
            />
          )}
        </label>
      ))}
      {errors.root && <p className="form-error">{errors.root.message}</p>}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
          <Save size={15} />
          {loading ? 'Salvando...' : editRecord ? 'Atualizar' : 'Salvar'}
        </button>
        {editRecord && onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            <X size={15} /> Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
