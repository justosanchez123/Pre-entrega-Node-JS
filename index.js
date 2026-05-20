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
                    if (id) {
                        const res = await fetch(`${API_URL}/${id}`);
                        const product = await res.json();
                        console.log(product);
                    } else {
                        const res = await fetch(API_URL);
                        const products = await res.json();
                        console.log(products);
                    }
                    break;

                case 'POST':
                    const [title, price, category] = params;
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

                    const newProduct = await res.json();
                    console.log(newProduct);
                    break;

                case 'DELETE':
                    const deleteRes = await fetch(`${API_URL}/${id}`, {
                        method: 'DELETE'
                    });

                    const deleted = await deleteRes.json();
                    console.log(deleted);
                    break;

                default:
                    console.log('Método no soportado');
            }
        }
main();