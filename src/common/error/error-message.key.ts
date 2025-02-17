export const errors = {
  unknown: 'errors.unknown',
  sign_up: {
    license_agreement: 'errors.sign_up.license_agreement', // Неприняты пользовательские соглашения
  },
  sign_in: {
    base: 'errors.sign_in.base', // Ошибка при авторизации
    data_invalid: 'errors.sign_up.data_invalid', // Неверный логин или пароль
  },
  logout: {
    base: 'errors.logout.base', // Ошибка при выходе пользователя из системы (не удалились токены на сервере)
  },
  update_password: {
    base: 'errors.update_password.base', // Не обновился пароль
  },
  user: {
    not_exist: 'errors.user.not_exist', // Пользователь не зарегистрирован
  },
  confirm_code: {
    delay: 'errors.confirm_code.delay', // Не вышло время для повторной отправки
    create: 'errors.confirm_code.create', // Ошибка при создании кода в бд
    matched: 'errors.confirm_code.matched', // Код не совпадает
    live: 'errors.confirm_code.live', // Время действия кода истекло
  },
  mail: {
    send_message: {
      registration: 'errors.mail.send_message.registration', // Ошибка при отправки сообщения кода подтверждения при регистрации
      update_password: 'errors.mail.send_message.update_password', // Ошибка отправки сообщения на смену пароля
    },
  },
  project: {
    not_found: 'errors.project.not_found',
    update: 'errors.project.update', // Ошибка при обновлении проекта
  },
  subscriber: {
    owner_project: 'errors.subscriber.owner_project', // Невозможно добавить подписчика, так как он является владельцеп проекта
    not_exist: 'errors.subscriber.not_exist',
  },
  permissions: {
    update: 'errors.permissions.update', // Ошибка при обновлении прав пользователя
  },
  validators: {
    is_defined: 'errors.validators.is_defined', // Поле обязательно
  },
};
