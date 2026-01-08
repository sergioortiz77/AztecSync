<?php
/**
 * Plugin Name:         MX with ME - Aztec Sync (Motor Ortocronobiológico)
 * Description:         Backend integral: Gestión de Usuarios (App), Tokens, Piedra del Sol e IA Gemini.
 * Version:             1.3.0
 * Author:              MX with ME Dev Team
 * Text Domain:         mx-aztec-sync
 * Requires at least:   6.0
 * Requires PHP:        7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('MXWM_Aztec_Sync')) {

    class MXWM_Aztec_Sync
    {
        private static $instance = null;

        private $glifos = [
            'Cipactli', 'Ehecatl', 'Calli', 'Cuetzpalin', 'Coatl',
            'Miquiztli', 'Mazatl', 'Tochtli', 'Atl', 'Itzcuintli',
            'Ozomahtli', 'Malinalli', 'Acatl', 'Ocelotl', 'Cuauhtli',
            'Cozcacuauhtli', 'Ollin', 'Tecpatl', 'Quiahuitl', 'Xochitl'
        ];

        public static function get_instance()
        {
            if (self::$instance == null) {
                self::$instance = new MXWM_Aztec_Sync();
            }
            return self::$instance;
        }

        private function __construct()
        {
            add_action('init', [$this, 'register_cpt']);
            add_action('init', [$this, 'register_shortcode']);
            add_action('rest_api_init', [$this, 'register_api_routes']);
            register_activation_hook(__FILE__, [$this, 'plugin_activation']);
        }

        public function plugin_activation()
        {
            $this->register_cpt();
            flush_rewrite_rules();
        }

        public function register_cpt()
        {
            $args = [
                'labels' => [
                    'name' => 'Bitácoras Aztec',
                    'singular_name' => 'Entrada Bitácora'
                ],
                'public' => false,
                'publicly_queryable' => false,
                'show_ui' => true,
                'show_in_menu' => true,
                'query_var' => true,
                'rewrite' => ['slug' => 'bitacora-azteca'],
                'capability_type' => 'post',
                'has_archive' => false,
                'hierarchical' => false,
                'menu_position' => 6,
                'menu_icon' => 'dashicons-calendar-alt',
                'supports' => ['title', 'custom-fields', 'author'],
                'show_in_rest' => false,
            ];
            register_post_type('bitacora_azteca', $args);
        }

        /**
         * RUTAS API REST (Namespace: mxwm/v1)
         */
        public function register_api_routes()
        {
            $ns = 'mxwm/v1';

            // --- AUTH & USUARIOS (NUEVO PARA LA APP) ---

            // POST: Registrar Usuario Nuevo desde App
            register_rest_route($ns, '/auth/register', [
                'methods' => 'POST',
                'callback' => [$this, 'register_new_user_from_app'],
                'permission_callback' => '__return_true' // Abierto para registro
            ]);

            // DELETE: Eliminar Cuenta (Requisito Google Play)
            register_rest_route($ns, '/auth/delete', [
                'methods' => 'DELETE',
                'callback' => [$this, 'delete_own_account'],
                'permission_callback' => function () {
                    return is_user_logged_in();
                }
            ]);

            // --- AZTEC SYNC CORE ---

            // GET: Datos del Día
            register_rest_route($ns, '/aztec-sync/hoy', [
                'methods' => 'GET',
                'callback' => [$this, 'get_current_glyph_data'],
                'permission_callback' => '__return_true'
            ]);

            // POST: Guardar Diario (Lógica 4 Acuerdos)
            register_rest_route($ns, '/aztec-sync/log', [
                'methods' => 'POST',
                'callback' => [$this, 'save_log_entry'],
                'permission_callback' => function () {
                    return is_user_logged_in();
                }
            ]);

            // GET: Historial
            register_rest_route($ns, '/aztec-sync/history', [
                'methods' => 'GET',
                'callback' => [$this, 'get_user_history'],
                'permission_callback' => function () {
                    return is_user_logged_in();
                }
            ]);

            // GET: Saldo de Tokens
            register_rest_route($ns, '/aztec-sync/balance', [
                'methods' => 'GET',
                'callback' => [$this, 'get_token_balance'],
                'permission_callback' => function () {
                    return is_user_logged_in();
                }
            ]);

            // POST: Proxy Gemini AI
            register_rest_route($ns, '/aztec-sync/gemini', [
                'methods' => 'POST',
                'callback' => [$this, 'handle_gemini_request'],
                'permission_callback' => '__return_true'
            ]);
        }

        /**
         * FUNCIONES DE AUTENTICACIÓN (NUEVAS)
         */
        public function register_new_user_from_app($request) {
            $params = $request->get_json_params();
            
            // 1. Sanitización
            $username = sanitize_user($params['username']);
            $email = sanitize_email($params['email']);
            $password = $params['password'];

            // 2. Validaciones
            if (empty($username) || empty($email) || empty($password)) {
                return new WP_Error('missing_fields', 'Todos los campos son obligatorios.', ['status' => 400]);
            }
            if (username_exists($username) || email_exists($email)) {
                return new WP_Error('user_exists', 'El usuario o correo ya están registrados.', ['status' => 409]);
            }

            // 3. Crear Usuario (Rol Subscriber por defecto)
            $user_id = wp_create_user($username, $password, $email);

            if (is_wp_error($user_id)) {
                return new WP_Error('registration_failed', $user_id->get_error_message(), ['status' => 500]);
            }

            // 4. Asignar Nivel 1 (Gratis) de PMP Automáticamente
            if (function_exists('pmpro_changeMembershipLevel')) {
                pmpro_changeMembershipLevel(1, $user_id);
            }

            // 5. Respuesta Exitosa
            return new WP_REST_Response([
                'status' => 'success',
                'user_id' => $user_id,
                'message' => 'Usuario registrado y asignado a Nivel 1.'
            ], 201);
        }

        public function delete_own_account($request) {
            $user_id = get_current_user_id();
            
            // Requiere archivo para borrado de usuarios si no estamos en admin
            require_once(ABSPATH . 'wp-admin/includes/user.php');

            // 1. Cancelar Membresía PMP (si existe)
            if (function_exists('pmpro_cancelMembershipLevel')) {
                pmpro_cancelMembershipLevel($user_id);
            }

            // 2. Borrar Usuario y Reasignar contenido (o borrarlo)
            // Al no pasar un segundo ID, el contenido se borra o va a la papelera según el tipo.
            // Para cumplir con ARCO (Derecho al Olvido), borrar es lo correcto.
            $deleted = wp_delete_user($user_id);

            if (!$deleted) {
                return new WP_Error('delete_failed', 'No se pudo eliminar la cuenta.', ['status' => 500]);
            }

            return new WP_REST_Response([
                'status' => 'success',
                'message' => 'Tu cuenta y datos han sido eliminados permanentemente.'
            ], 200);
        }

        /**
         * SHORTCODE APP
         */
        public function register_shortcode()
        {
            add_shortcode('aztec_sync_app', [$this, 'render_app_container']);
        }

        public function render_app_container($atts)
        {
            $app_url = plugin_dir_url(__FILE__) . 'app-dist/index.html';
            return '
            <div id="aztec-app-wrapper" style="display: flex; justify-content: center; align-items: center; width: 100%; background-color: #050505; padding: 20px 0;">
                <iframe 
                    src="' . esc_url($app_url) . '" 
                    title="Aztec Sync App"
                    style="width: 100%; max-width: 450px; height: 85vh; min-height: 600px; border: 1px solid #333; border-radius: 30px; box-shadow: 0 0 50px rgba(0, 240, 255, 0.15);"
                    allow="geolocation; microphone; camera; display-capture"
                ></iframe>
            </div>';
        }

        /**
         * GEMINI API LOGIC
         */
        private function mxwm_call_gemini_api($prompt)
        {
            if (!defined('GEMINI_API_KEY')) {
                return new WP_Error('api_key_missing', 'La clave de API de Gemini no está configurada.');
            }

            $api_key = GEMINI_API_KEY;
            $api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $api_key;

            $body = array(
                'contents' => array(
                    array('parts' => array(array('text' => $prompt)))
                )
            );

            $response = wp_remote_post($api_url, array(
                'method' => 'POST',
                'headers' => array('Content-Type' => 'application/json'),
                'body' => json_encode($body),
                'timeout' => 60,
            ));

            if (is_wp_error($response)) return $response;

            $response_body = json_decode(wp_remote_retrieve_body($response), true);

            if (isset($response_body['candidates'][0]['content']['parts'][0]['text'])) {
                return $response_body['candidates'][0]['content']['parts'][0]['text'];
            }

            return new WP_Error('gemini_error', 'Error en respuesta de Gemini.');
        }

        public function handle_gemini_request($request)
        {
            $params = $request->get_json_params();
            $user_prompt = sanitize_text_field($params['prompt'] ?? '');

            if (empty($user_prompt)) return new WP_Error('empty_prompt', 'Prompt vacío', ['status' => 400]);

            $ai_response = $this->mxwm_call_gemini_api($user_prompt);

            if (is_wp_error($ai_response)) return $ai_response;

            return new WP_REST_Response([
                'status' => 'success',
                'ai_response' => $ai_response
            ], 200);
        }

        /**
         * CÁLCULO ORTOCRONOBIOLÓGICO
         */
        private function calcular_glifo($timestamp)
        {
            $known_date = strtotime('2025-12-28'); // Día Águila (14)
            $known_index = 14;

            $seconds_diff = $timestamp - $known_date;
            $days_diff = floor($seconds_diff / (60 * 60 * 24));

            $index = ($known_index + $days_diff) % 20;
            if ($index < 0) $index = 20 + $index;

            return [
                'index' => $index,
                'nombre' => $this->glifos[$index],
                'nombre_nahuatl' => $this->glifos[$index]
            ];
        }

        public function get_current_glyph_data($request)
        {
            $timestamp = $request->get_param('timestamp') ? intval($request->get_param('timestamp')) : time();
            $glifo = $this->calcular_glifo($timestamp);

            return new WP_REST_Response([
                'status' => 'success',
                'fecha_servidor' => date('Y-m-d H:i:s', $timestamp),
                'glifo' => $glifo,
                'meta' => ['ciclo' => 'Circa Vigesimal']
            ], 200);
        }

        /**
         * LÓGICA DE GUARDADO Y TOKENS (4 ACUERDOS)
         */
        public function save_log_entry($request)
        {
            $user_id = get_current_user_id();
            $params = $request->get_json_params();

            // 1. Validación
            if (empty($params['titulo_dia'])) {
                return new WP_Error('missing_data', 'El título del día es obligatorio.', ['status' => 400]);
            }

            // 2. Valores de Tokens
            $VALOR_TITULO = 5;
            $VALOR_BINARIO = 2;
            $VALOR_TEXTO = 15;

            $tokens_ganados = 0;

            // --- A. Título del día ---
            $titulo = sanitize_text_field($params['titulo_dia']);
            if (!empty($titulo)) {
                $tokens_ganados += $VALOR_TITULO;
            }

            // --- B. Preguntas Binarias (Los 4 Acuerdos) ---
            $check_personal = isset($params['check_personal']) ? ($params['check_personal'] ? 1 : 0) : null;
            $check_palabras = isset($params['check_palabras']) ? ($params['check_palabras'] ? 1 : 0) : null;
            $check_suposiciones = isset($params['check_suposiciones']) ? ($params['check_suposiciones'] ? 1 : 0) : null;
            $check_esfuerzo = isset($params['check_esfuerzo']) ? ($params['check_esfuerzo'] ? 1 : 0) : null;

            if (!is_null($check_personal)) $tokens_ganados += $VALOR_BINARIO;
            if (!is_null($check_palabras)) $tokens_ganados += $VALOR_BINARIO;
            if (!is_null($check_suposiciones)) $tokens_ganados += $VALOR_BINARIO;
            if (!is_null($check_esfuerzo)) $tokens_ganados += $VALOR_BINARIO;

            // --- C. Preguntas Abiertas (Profundas) ---
            $q_programacion = sanitize_textarea_field($params['q_programacion'] ?? '');
            $q_creacion = sanitize_textarea_field($params['q_creacion'] ?? '');

            if (strlen($q_programacion) > 5) $tokens_ganados += $VALOR_TEXTO;
            if (strlen($q_creacion) > 5) $tokens_ganados += $VALOR_TEXTO;

            // 4. Metadatos
            $meta_input = [
                'fecha_real' => sanitize_text_field($params['fecha']),
                'glifo_registrado' => sanitize_text_field($params['glifo_nombre']),
                'emocion_predominante' => sanitize_text_field($params['emocion']),
                
                'check_personal' => $check_personal,
                'check_palabras' => $check_palabras,
                'check_suposiciones' => $check_suposiciones,
                'check_esfuerzo' => $check_esfuerzo,
                
                'q_programacion' => $q_programacion,
                'q_creacion' => $q_creacion,
                
                'tokens_earned_this_entry' => $tokens_ganados
            ];

            // 5. Insertar Post
            $post_id = wp_insert_post([
                'post_title' => $titulo,
                'post_content' => '',
                'post_type' => 'bitacora_azteca',
                'post_status' => 'private',
                'post_author' => $user_id,
                'meta_input' => $meta_input
            ]);

            if (is_wp_error($post_id)) {
                return new WP_Error('db_error', 'Error al guardar.', ['status' => 500]);
            }

            // 6. Actualizar Billetera
            $current_balance = (int) get_user_meta($user_id, 'mxwm_wallet_balance', true);
            $new_balance = $current_balance + $tokens_ganados;
            update_user_meta($user_id, 'mxwm_wallet_balance', $new_balance);

            return new WP_REST_Response([
                'status' => 'success',
                'id' => $post_id,
                'tokens_ganados' => $tokens_ganados,
                'nuevo_saldo' => $new_balance,
                'message' => 'Bitácora guardada en la Matriz.'
            ], 201);
        }

        /**
         * CONSULTAS DE SALDO E HISTORIAL
         */
        public function get_token_balance($request)
        {
            $user_id = get_current_user_id();
            $balance = (int) get_user_meta($user_id, 'mxwm_wallet_balance', true);
            return new WP_REST_Response(['balance' => $balance], 200);
        }

        public function get_user_history($request)
        {
            $user_id = get_current_user_id();
            $posts = get_posts([
                'post_type' => 'bitacora_azteca',
                'author' => $user_id,
                'posts_per_page' => 40,
                'post_status' => 'private',
                'orderby' => 'date',
                'order' => 'DESC'
            ]);

            $history = [];
            foreach ($posts as $p) {
                $history[] = [
                    'id' => $p->ID,
                    'fecha' => get_post_meta($p->ID, 'fecha_real', true),
                    'titulo' => $p->post_title,
                    'glifo' => get_post_meta($p->ID, 'glifo_registrado', true),
                    'tokens' => get_post_meta($p->ID, 'tokens_earned_this_entry', true)
                ];
            }
            return new WP_REST_Response($history, 200);
        }
    }

    MXWM_Aztec_Sync::get_instance();
}