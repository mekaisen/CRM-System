export const filterTodos = (todos: Todo[], filter: 'all' | 'completed' | 'inWork') => {
  return todos.filter((t) => {
    switch (filter) {
      case 'all':
        return true;
      case 'completed':
        return t.isDone === true;
      case 'inWork':
        return t.isDone === false;
      default:
        return false;
    }
  });
};
