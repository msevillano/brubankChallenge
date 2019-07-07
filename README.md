# Ejercicio: Open Source y Calentamiento global

## El ejercicio

Queremos ver si existe una correlación entre la creación de proyectos Open Source
y el aumento de temperaturas.

El ejercicio consiste en crear una API REST que tiene un solo endpoint. Este recibe
como único parámetro un `username` de un usuario de GitHub y retorna un JSON con
2 datos: `Cantidad de repos` y `Temperatura promedio` de los días en los que ese
usuario creó repos.

La idea es usar la API de GitHub para obtener la ubicación del usuario y sus repos
para ir a alguna API de clima y traer la temperatura promedio del día de creación
de cada repo.

El ejercicio se puede realizar en cualquier lenguaje de programación siempre y
cuando se especifiquen los pasos de instalación y ejecución del programa.

## Entregables

- Repositorio de código y tests
- Archivo de documentación de la API

## Puntos extra

- Caching de la información en una DB local
- Explicación de decisiones a la hora de armar la API en el archivo de docs

## Recursos

- Obtener info de un [usuario de GitHub](https://api.github.com/users/:username)
- [Repos del usuario](https://api.github.com/users/:username/repos)
- Una [API de clima](https://developer.worldweatheronline.com/api/historical-weather-api.aspx) que tiene historial (Requiere API Key, tiene free trial) API Key: 5937d3446b59435b820182549170504

# Documentacion:

El ejercicio se realizó en Node.JS y usando el framework Serverless, para poder correrlo se debe tener instalado Node y
NPM.

Cada Clase, función y método tiene su respectiva documentación hecha en JSDoc(se puede observar en cada archivo dentro
de la carpeta src).

## Inicializacion del proyecto

Para instalar node y npm en Mac(requiere HomeBrew): `brew install node@10`.

Para instalar las dependencias del proyecto: `npm i` estando en el root del proyecto.

Para correr los unit-tests `npm test` (requiere tener instaladas las dependencias).

para iniciar el proyecto `npm start` (requiere tener instaladas las dependencias).

una vez iniciado el proyecto, la API se puede consultar de la siguiente manera: `localhost:4000/weathertemperatureavg?user=<yourGitHubUserNameGoesHere>`

## Estructura del proyecto

```txt
  config/  ............................  archivos *.yml con la configuración del entorno segun el cual son nombrados
  src/  ...............................  aqui se encuentra el código de la app
    |__ public/  ......................  aqui se encuentran las funciones que se exponen como lambdas(endpoints)
    |__ services/  ....................  aqui se encuentran los servicios con los que se pueden consumir las APIs externas (GitHub, weather)
    |__ utils/  .......................  utilidades varias
  test/   .............................  replica la estructura de src, por cada *.js en dentro de src hay un respectivo *.test.js 
    |-- setup/  .......................  setea el entorno para poder realizar los tests
  **.*  ...............................  los archivos encontrados aqui son para configuraciond e framework, entorno y transpiladores (Jest, Babel, etc.)
```

## Consideraciones

La idea detrás de la implementación es la siguiente dado un user de GitHub(si este existe), obtener location del mismo y
las fechas de creación de los repositorios de los cuales sea owner y no los haya forkeado. De no poder recuperar la
data, o encontrar algún error en la misma, se termina el proceso, forwardeando la info del fallo.

Una vez recuperada la info del usuario, se procede a buscar para cada fecha de creación de sus repositorios, la 
temperatura en su location(no fue posible hacer una única request a la API de clima, ya que el maximo rango que otorga 
es de 1 mes). En caso de no poder obtener la info de la API del clima se procede de la misma manera que con la 
información del usuario.

Obtenida toda la información se realiza el cálculo del promedio y de devuelve la cantidad de repositorios, y el
resultado del cálculo ateriormente mencionado.

Para realizar el cacheo de datos, el procedimiento seria el siguiente:

    - cada vez que se devuelve un resultado al cliente, se guarda en una DB la info del resultado, con el userName de
    gitHub como key.
    - el primer paso del handler pasa a ser una busqueda en la base de datos, si existe en la misma se retorna el objeto
    guardado.
    - se debe armar un Job que corra cada X tiempo para borrar los registros mas viejos de la DB.
    
    
## Posibles iteraciones, mejoras

    - la API de GitHub permite obtener muchos mas datos que solo los repositorios propios del usuario, tambien permite
    acceso a mayor cantidad de datos si se encuetra logueado em la misma.
    - el endpoint no debería ser público, si va a ser accedido por una app de interface humana, deberia requerir un JWT
    o similar, si en cambio va a ser accedida por otro servicio, deberia requerir una API key.
    - buscar otro servicio de clima que soporte búsqueda mas compleja, para poder hacer solo una request al mismo.
 
