// funcion de chatGPT para generar UUIDs que usaremos para identificar los productos mas adelante

/*
  Utiliza una expresión regular /[xy]/g para hacer coincidir cada caracter 'x' y 'y' en la cadena de plantilla del UUID.
  Para cada caracter coincidente, genera un dígito hexadecimal aleatorio (r) utilizando Math.random() y manipulación de bits (| 0).
  Para los caracteres 'x', utiliza el dígito aleatorio directamente.
  Para los caracteres 'y', aplica operaciones específicas de bits ((r & 0x3 | 0x8)) para asegurar que el UUID cumpla con la especificación de la versión 4 de UUID.
  Convierte cada dígito aleatorio en una cadena hexadecimal utilizando .toString(16) y devuelve la cadena UUID final.
*/

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8; // operador ternario
    return v.toString(16);
  });
}

// Example usage:
// const uuid = generateUUID();
// console.log(uuid); // Output: something like "3d16f03e-08b4-4c08-9e1d-78bfbf7b0ac5"

// clases con ES11
class Product {
  // #variable es sintaxis de variables privadas
  #title; // name seria mejor pero asi lo pide la consigna
  #price;
  #description;
  #thumbnail;
  #code; // pesimo nombre de variable pero es lo que pide la consigna, es para un codigo de barra
  #stock;
  #id;

  // ya que javascript es un lenguaje horrible hay que cuidar de construir nuestro producto
  // de manera distinta si le pasamos un objeto a addProduct
  // sino llegamos a esto Product: [object Object], Price: undefined, Id: d437c6b2-fbbe-4c90-b9b3-12275ec1e015
  constructor(titleOrObj, price, description, thumbnail, code, stock) {
    if (typeof titleOrObj === "object") {
      const { title, price, description, thumbnail, code, stock } = titleOrObj;
      this.#title = title;
      this.#price = price;
      this.#description = description;
      this.#thumbnail = thumbnail;
      this.#code = code;
      this.#stock = stock;
    } else {
      this.#title = titleOrObj;
      this.#price = price;
      this.#description = description;
      this.#thumbnail = thumbnail;
      this.#code = code;
      this.#stock = stock;
    }
    this.#id = generateUUID(); // generamos un id unico
    // alternativamente se podria guardar un id que referencia
    // la posicion en el arreglo de productos y se le asignaria el
    // id en la clase productManager, pero me parece mas robusta esta
    // solucion
  }

  getTitle() {
    return this.#title;
  }

  getPrice() {
    return this.#price;
  }

  getDescription() {
    return this.#description;
  }

  getThumbnail() {
    return this.#thumbnail;
  }

  getCode() {
    return this.#code;
  }

  getStock() {
    return this.#stock;
  }

  getId() {
    return this.#id;
  }

  printProduct() {
    console.log(
      // template literal
      `Title: ${this.#title}, Price: ${this.#price}, Id: ${this.#id}`
    );
  }
}

class ProductManager {
  #products;

  constructor() {
    this.#products = []; // iniciamos con un arreglo vacio
  }

  addProduct(product) {
    // si ya existe un producto con el codigo ingresado entonces return
    // La función some() es un método de los arrays en JavaScript
    // que comprueba si al menos un elemento del array cumple con una condición especificada.
    if (
      this.#products.some(
        // En JavaScript, el uso del prefijo # para marcar una variable
        // como privada es una característica sintáctica que proporciona
        // un indicador visual de que se espera que esa variable sea tratada
        // como privada. Sin embargo, en la práctica, estas variables privadas
        // aún pueden ser accedidas directamente desde fuera de la clase donde están definidas.
        // por lo tanto esto funciona aunque deberia tirar un error
        //  (productoExistente) => productoExistente.code == product.code

        // el codigo correcto es:
        (productoExistente) => productoExistente.getCode() === product.getCode()
      )
    ) {
      console.error("Ya existe un producto con este código.");
      return;
    }

    this.#products.push(product); // push agrega al final del arreglo
  }

  getProducts() {
    return this.#products;
  }

  // iteramos nuestro arreglo de productos para obtener todos los productos
  printProducts() {
    console.log("Estos son los productos almacenados:");
    this.#products.forEach((product) => {
      /*
      console.log(
        // template literal
        `Title: ${product.getTitle()}, Price: ${product.getPrice()}, Id: ${product.getId()}`
      );
      */
      product.printProduct();
    });
  }

  getProductById(productId) {
    const product = this.#products.find(
      (productoExistente) => productoExistente.getId() === productId
    );
    return product
      ? (console.log("Producto encontrado: ", product), product)
      : console.error("No existe un producto con ese Id."); // if product existe return else not found
  }
}

const manager = new ProductManager();
console.log(manager.getProducts());

const productoPrueba = {
  title: "producto prueba",
  price: 200,
  description: "Este es un producto prueba",
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
};

const product1 = new Product(productoPrueba);
manager.addProduct(product1);
console.log(manager.getProducts());

const product2 = new Product(
  "producto prueba",
  200,
  "Este es un producto prueba",
  "Sin imagen",
  "abc123",
  25
);
manager.addProduct(product2); // error porque ya existe un producto con este codigo

manager.printProducts();

const products = manager.getProducts();
//console.log(products[0].getId())

const productoEncontrado = manager.getProductById(products[0].getId());
productoEncontrado.printProduct();

manager.getProductById("123456");
