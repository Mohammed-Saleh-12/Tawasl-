import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";

interface FAQ {
  id?: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  faq?: FAQ;
  mode?: 'create' | 'edit';
}

const categories = [
  'general',
  'communication-skills',
  'public-speaking',
  'interview-preparation',
  'team-collaboration',
  'conflict-resolution',
  'body-language',
  'active-listening'
];

// Simple Modal Component with completely white interface
function SimpleModal({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '95%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e5e7eb'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px', 
          borderBottom: '2px solid #e5e7eb', 
          paddingBottom: '20px',
          backgroundColor: '#ffffff'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            margin: 0, 
            color: '#111827',
            textShadow: 'none',
            backgroundColor: '#ffffff'
          }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '50%',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>
        <div style={{ backgroundColor: '#ffffff' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function FAQFormModal({ isOpen, onOpenChange, faq, mode = 'create' }: FAQFormModalProps) {
  const [formData, setFormData] = useState<FAQ>({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || 'general'
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: FAQ) => {
      return await apiClient.post('/faqs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
      toast({
        title: "Success",
        description: "FAQ created successfully!",
      });
      onOpenChange(false);
      setFormData({ question: '', answer: '', category: 'general' });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create FAQ. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FAQ) => {
      return await apiClient.put(`/faqs/${faq?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
      toast({
        title: "Success",
        description: "FAQ updated successfully!",
      });
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update FAQ. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'create') {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  const handleInputChange = (field: keyof FAQ, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={() => onOpenChange(false)}
      title={mode === 'create' ? 'Add New FAQ' : 'Edit FAQ'}
    >
      <form onSubmit={handleSubmit} style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '24px',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151'
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category} style={{ backgroundColor: '#ffffff' }}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Question *
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            placeholder="Enter the question..."
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151'
            }}
          />
        </div>

        <div style={{ backgroundColor: '#ffffff' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            fontWeight: 'bold', 
            color: '#374151',
            backgroundColor: '#ffffff'
          }}>
            Answer *
          </label>
          <textarea
            value={formData.answer}
            onChange={(e) => handleInputChange('answer', e.target.value)}
            placeholder="Enter the answer..."
            rows={6}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#ffffff',
              color: '#374151',
              resize: 'vertical',
              minHeight: '120px'
            }}
          />
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '12px', 
          marginTop: '20px',
          backgroundColor: '#ffffff'
        }}>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending || updateMutation.isPending}
            style={{
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              color: '#374151',
              cursor: (createMutation.isPending || updateMutation.isPending) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#3B82F6',
              color: 'white',
              cursor: (createMutation.isPending || updateMutation.isPending) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              opacity: (createMutation.isPending || updateMutation.isPending) ? 0.6 : 1
            }}
          >
            {(createMutation.isPending || updateMutation.isPending) ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                {mode === 'create' ? 'Create FAQ' : 'Update FAQ'}
              </>
            )}
          </button>
        </div>
      </form>
    </SimpleModal>
  );
} 