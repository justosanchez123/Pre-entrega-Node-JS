const [, , method, path, ...params] = process.argv;

const API_URL = 'https://fakestoreapi.com/products';

const showHelp = () => {
    console.log(`
══════════════════════════════════════════════════════════════════════════
                GESTOR DE PRODUCTOS EN FAKESTORE API                  
══════════════════════════════════════════════════════════════════════════
                MÉTODOS DISPONIBLES: GET,POST,DELETE
──────────────────────────────────────────────────────────────────────────
CONSULTAR TODOS LOS PRODUCTOS:npm run start GET products
──────────────────────────────────────────────────────────────────────────
CONSULTAR PRODUCTO POR ID:npm run start GET products/{id}
Ejemplo: npm start GET products/7
──────────────────────────────────────────────────────────────────────────
CREAR NUEVO PRODUCTO: npm run start POST products "title" price "category"
Ejemplo: npm start POST products T-Shirt-Rex 300 remeras
──────────────────────────────────────────────────────────────────────────
ELIMINAR PRODUCTO: npm run start DELETE products/{id}
Ejemplo: npm start DELETE products/7
─────────────────────────────────────────────────────────────────────────
`);
};

if (!method || !path) {
    showHelp();
    process.exit(1);
};


async function main() {
    const [resource, id] = path.split('/');

    switch (method.toUpperCase()) {

        case 'GET':

            if (id && isNaN(id)) {
                console.log('ERROR: El ID debe ser numérico');
                return;
            }

            try {
                if (id) {
                    const res = await fetch(`${API_URL}/${id}`);
                    const text = await res.text();
                    if (!text) {
                        console.log('ERROR: No existe un producto con ese ID');
                        return;
                    }
                    const product = JSON.parse(text);
                    console.log(product);
                } else {
                    const res = await fetch(API_URL);
                    if (!res.ok) {
                        console.log('ERROR: No se pudieron obtener los productos');
                        return;
                    }
                    const products = await res.json();
                    console.log(products);
                }

            } catch (error) {
                console.log('ERROR: Problema de conexión con la API');
            }
            break;

        case 'POST':

            const [title, price, category] = params;
            if (!title || !price || !category) {
                console.log('ERROR: Todos los campos son obligatorios');
                return;
            }
            if (isNaN(price)) {
                console.log('ERROR: El precio debe ser numérico');
                return;
            }

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title,
                        price: parseFloat(price),
                        category
                    })
                });
                if (!res.ok) {
                    console.log('ERROR: No se pudo crear el producto');
                    return;
                }
                const newProduct = await res.json();
                console.log('Producto creado correctamente');
                console.log(newProduct);

            } catch (error) {
                console.log('ERROR: Falló la conexión con la API');
            }
            break;

        case 'DELETE':

            if (!id) {
                console.log('ERROR: Debe ingresar un ID');
                return;
            }
            if (isNaN(id)) {
                console.log('ERROR: El ID debe ser numérico');
                return;
            }

            try {
                const deleteRes = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE'
                });
                if (!deleteRes.ok) {
                    console.log('ERROR: No se pudo eliminar el producto');
                    return;
                }
                const deleted = await deleteRes.json();
                console.log('Producto eliminado correctamente');
                console.log(deleted);

            } catch (error) {
                console.log('ERROR: Falló la conexión con la API');
            }
            break;

        default:
            console.log('ERROR: Método no soportado');
    }
}
main();