

# Test API Veri Dökümantasyonu

## İSTENİLENLER

- Backend olarak **NodeJs**
- Database için **PostgreSQL**
- Frontend için **React** mutlaka kullanılmalı.

Bu ödevde geliştiricinin bir API üzerinden verileri, uygulama üzerinde kendi belirleyeceği şekilde oluşturduğu bir veritabanına verileri yazarak ve ardından bu verileri okuyarak bir web sayfasında göstermesi amaçlanmaktadır.

**Önemli Detaylar:**
- Veri, API üzerinden belirli bir periyotta düzenli olarak alınıp veritabanına yazılacak.
- Eğer API üzerinden gelen veri güncellenmiş ise yeni kayıt açılacak, aynı veri geldiyse kayıt veritabanında bulunup güncellenecektir.
- Veritabanındaki veri sürekli olarak API üzerinden gelen veri ile senkron olacaktır.

### Raporlama
- Web sayfasında hem API'deki bilgiler çekilip hem de bu gösterim katmanında **Group-By** vb. yöntemler ile aşağıdaki örnekte olduğu gibi kırılımlı olarak sunulacaktır.
- 1. kırılım: ilk 3 rakam
- 2. kırılım: ilk 5 rakam
- 3. kırılım: toplam 8 rakam
- Kırılımlar nokta (.) ile ayrılacaktır.
- Her kırılımın borç ve alacak toplamları da gösterilecektir.

Projeyi tamamladığınızda; web sayfasının HTTP linkini projeyi bitirdikten sonra **whatsapp (0542 315 88 12)** numarasına gönderiniz.

---

## API Bilgileri

- **API Tipi:** Rest API
- **Kullanıcı Adı:** apitest
- **Şifre:** test123

---


### 1 - Token Alma

- **URL:** Özel olarak isteyiniz
- **Metot:** POST
- **Headers:**
  - Content-Type: application/json
  - Authorization: Basic Auth

**Gönderilecek Body:**
```json
{}
```

**Dönecek Örnek Yanıt:**
```json
{
  "response": {
    "token": "xxxyyyzzz000112233"
  },
  "messages": [
    {
      "code": "0",
      "message": "OK"
    }
  ]
}
```

Yanıtta ihtiyacımız olan: `response.token`

---

### 2. Veri Çekme

- **URL:** (Link özel olarak verilecektir)
- **Metot:** PATCH
- **Headers:**
  - Content-Type: application/json
"  - Authorization: Bearer Token (Bearer response.token)

#### Gönderilecek Body
```json
{
  "fieldData": {},
  "script": "getData"
}
```

#### Dönecek Örnek Yanıt
```json
{
  "response": {
    "scriptResult": "[{}]",
    "scriptError": "0",
    "modId": "4"
  },
  "messages": [
    {
      "code": "0",
      "message": "OK"
    }
  ]
}
```

Yanıtta ihtiyacımız olan: **response.scriptResult**

---

> **NOT:** Son dönen verinin tipi JSON olacak. Bu veriyi uygun hale getirip istenilen tablolama işlemini yapınız.



