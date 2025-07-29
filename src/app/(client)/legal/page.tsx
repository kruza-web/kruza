export default function LegalPage() {
  return (
    <div className="bg-white dark:bg-background text-black dark:text-white py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-center mb-8">
          Términos, Condiciones y Políticas de Privacidad
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-12">
          Última actualización: 29 de Julio de 2025
        </p>

        <div className="space-y-12">
          <section id="terminos">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">1. Términos y Condiciones</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Bienvenido a KRUZA. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de KRUZA. Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones. No continúes usando KRUZA si no estás de acuerdo con todos los términos y condiciones establecidos en esta página.
              </p>
              <h3 className="text-xl font-semibold pt-2">1.1. Propiedad Intelectual</h3>
              <p>
                El sitio y su contenido original, características y funcionalidad son propiedad de KRUZA y están protegidos por derechos de autor internacionales, marcas registradas, patentes, secretos comerciales y otras leyes de propiedad intelectual o derechos de propiedad.
              </p>
              <h3 className="text-xl font-semibold pt-2">1.2. Uso del Sitio</h3>
              <p>
                Se te concede una licencia limitada para acceder y hacer uso personal de este sitio. Esta licencia no incluye ninguna reventa o uso comercial de este sitio o su contenido; cualquier colección y uso de listados de productos, descripciones o precios; o cualquier uso de minería de datos, robots o herramientas similares de recolección y extracción de datos.
              </p>
            </div>
          </section>

          <section id="privacidad">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">2. Política de Privacidad</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Esta Política de Privacidad se aplica al sitio y a todos los productos y servicios ofrecidos por KRUZA, en cumplimiento con la Ley de Protección de Datos Personales N° 25.326 de la República Argentina.
              </p>
              <h3 className="text-xl font-semibold pt-2">2.1. Información que Recopilamos</h3>
              <p>
                Recopilamos varios tipos de información para proporcionar y mejorar nuestro Servicio. Los datos pueden incluir:
              </p>
              <ul className="list-disc list-inside pl-4">
                <li><strong>Datos Personales:</strong> Correo electrónico, nombre, teléfono, dirección de envío.</li>
                <li><strong>Datos de Uso:</strong> Información sobre cómo se accede y utiliza el Servicio (ej. dirección IP, tipo de navegador).</li>
              </ul>
              <h3 className="text-xl font-semibold pt-2">2.2. Uso de Datos</h3>
              <p>
                KRUZA utiliza los datos recopilados para procesar tus pedidos, mejorar el servicio, y comunicarnos contigo sobre tu compra o cambios en nuestras políticas.
              </p>
              <h3 className="text-xl font-semibold pt-2">2.3. Derechos del Titular de los Datos</h3>
              <p>
                De acuerdo con la Ley 25.326, tienes derecho a acceder, rectificar y suprimir tus datos personales. El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses. La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos.
              </p>
            </div>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">3. Política de Cookies</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Nuestro sitio web utiliza cookies para mejorar tu experiencia. Las cookies son pequeños archivos de datos que se almacenan en tu dispositivo.
              </p>
              <h3 className="text-xl font-semibold pt-2">3.1. Tipos de Cookies que Utilizamos</h3>
              <ul className="list-disc list-inside pl-4">
                <li><strong>Cookies Esenciales:</strong> Necesarias para que el sitio web funcione, como mantener los productos en tu carrito de compras mientras navegas entre páginas. Estas cookies son temporales y se eliminan al cerrar la sesión. No almacenan información personal identificable.</li>
                <li><strong>Cookies de Análisis:</strong> Nos permiten entender cómo los visitantes interactúan con el sitio de forma anónima.</li>
              </ul>
              <p>
                Puedes instruir a tu navegador para que rechace las cookies. Sin embargo, si no las aceptas, es posible que no puedas utilizar funciones esenciales como el carrito de compras.
              </p>
            </div>
          </section>

          <section id="contacto">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">4. Contacto</h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Si tienes alguna pregunta sobre estos Términos y Políticas, por favor contáctanos a través de nuestro canal de WhatsApp o al correo electrónico somoskruza@gmail.com.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
