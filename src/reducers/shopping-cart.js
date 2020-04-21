const updateCartItems = (cartItems, item, idx) => {
  // Удаляю элемент 
  if (item.count === 0 || item.count < 0) {
    return [
      ...cartItems.slice(0, idx),
      ...cartItems.slice(idx + 1)
    ]
  };
  // Добавляю элемент
  if (idx === -1) {
    return [
      ...cartItems,
      item
    ]
  };
  // Обновляю существующий массив
  return [
    ...cartItems.slice(0, idx),
    item,
    ...cartItems.slice(idx + 1)
  ]
};

const updateCartItem = (book, item = {}, quantity) => {

  const { id = book.id, count = 0, 
          title = book.title, total = 0 } = item;

  return {
    id,
    title,
    count: count + quantity,
    total: total + quantity * book.price  // Уменьшаем и увеличение кол-во книг на 1
  }
};

const updateOrder = (state, bookId, quantity) => {
  const { bookList: {books}, shoppingCart: {cartItems} } = state;

  const book = books.find(({id}) => id === bookId);  // Поиск книги
  const itemIndex = cartItems.findIndex(({id}) => id === bookId); // Поиск индекса элемента в массиве
  const item = cartItems[itemIndex];
  
  const newItem = updateCartItem(book, item, quantity);
  return {
    orderTotal: 0,           
    cartItems: updateCartItems(cartItems, newItem, itemIndex)
  };
};

const updateShoppingCart = (state, action) => {

  if (state === undefined) {
    return {
      cartItems: [],
      orderTotal: 0
    }
  };

  switch (action.type) {
     // Увеличиваю кол-во книг
    case 'BOOK_ADDED_TO_CART':
      return updateOrder(state, action.payload, 1);
    // Уменьшаю кол-во книг
    case 'BOOK_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, -1);
    // Удаляю все книги
    case 'ALL_BOOKS_REMOVED_FROM_CART':
      const item = state.shoppingCart.cartItems.find(({id}) => id === action.payload);
      return updateOrder(state, action.payload, -item.count);
      
    default:
      return state.shoppingCart;
  };
};

export default updateShoppingCart;