import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoCard from '../TodoCard';

describe('TodoCard Component', () => {
  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    dueDate: '2025-12-25',
    completed: 0,
    createdAt: '2025-11-01T00:00:00Z'
  };

  const mockHandlers = {
    onToggle: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render todo title and due date', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText(/December 25, 2025/)).toBeInTheDocument();
  });

  it('should render unchecked checkbox when todo is incomplete', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should render checked checkbox when todo is complete', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should call onToggle when checkbox is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should show edit button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    expect(editButton).toBeInTheDocument();
  });

  it('should show delete button', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    expect(deleteButton).toBeInTheDocument();
  });

  it('should call onDelete when delete button is clicked and confirmed', () => {
    window.confirm = jest.fn(() => true);
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const deleteButton = screen.getByLabelText(/Delete/);
    fireEvent.click(deleteButton);
    
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id);
  });

  it('should enter edit mode when edit button is clicked', () => {
    render(<TodoCard todo={mockTodo} {...mockHandlers} isLoading={false} />);
    
    const editButton = screen.getByLabelText(/Edit/);
    fireEvent.click(editButton);
    
    expect(screen.getByDisplayValue('Test Todo')).toBeInTheDocument();
  });

  it('should apply completed class when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: 1 };
    const { container } = render(<TodoCard todo={completedTodo} {...mockHandlers} isLoading={false} />);
    
    const card = container.querySelector('.todo-card');
    expect(card).toHaveClass('completed');
  });

  it('should not render due date when dueDate is null', () => {
    const todoNoDate = { ...mockTodo, dueDate: null };
    render(<TodoCard todo={todoNoDate} {...mockHandlers} isLoading={false} />);
    
    expect(screen.queryByText(/Due:/)).not.toBeInTheDocument();
  });

  describe('Overdue indication', () => {
    const yesterday = '2020-01-01';
    const today = '2020-01-02';
    const tomorrow = '2020-01-03';
    const referenceDate = new Date(2020, 0, 2); // 2020-01-02, matches `today`

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(referenceDate);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('shows the overdue badge for an incomplete past-due todo', () => {
      const todo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.getByText(/Overdue/)).toBeInTheDocument();
    });

    it('does not show the overdue badge for a completed past-due todo', () => {
      const todo = { ...mockTodo, dueDate: yesterday, completed: 1 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('does not show the overdue badge for a todo due today', () => {
      const todo = { ...mockTodo, dueDate: today, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('does not show the overdue badge for a todo due in the future', () => {
      const todo = { ...mockTodo, dueDate: tomorrow, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('does not show the overdue badge for a todo without a due date', () => {
      const todo = { ...mockTodo, dueDate: null, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('removes the overdue badge immediately after the todo is rendered as completed', () => {
      const todo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      const { rerender } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText(/Overdue/)).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...todo, completed: 1 }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('removes the overdue badge immediately after the due date is edited to today', () => {
      const todo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      const { rerender } = render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);
      expect(screen.getByText(/Overdue/)).toBeInTheDocument();

      rerender(<TodoCard todo={{ ...todo, dueDate: today }} {...mockHandlers} isLoading={false} />);
      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });

    it('shows the overdue badge above the edit form inputs when editing an incomplete, overdue todo', () => {
      const todo = { ...mockTodo, dueDate: yesterday, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      fireEvent.click(screen.getByLabelText(/Edit/));

      const badge = screen.getByText(/Overdue/);
      const titleInput = screen.getByLabelText('Edit todo title');
      expect(badge).toBeInTheDocument();
      // eslint-disable-next-line no-bitwise
      expect(badge.compareDocumentPosition(titleInput) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('does not show the overdue badge when editing a non-overdue todo', () => {
      const todo = { ...mockTodo, dueDate: tomorrow, completed: 0 };
      render(<TodoCard todo={todo} {...mockHandlers} isLoading={false} />);

      fireEvent.click(screen.getByLabelText(/Edit/));

      expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    });
  });
});
