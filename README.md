# Merlin Discord Bot

<div 
  <h3>Gelişmiş Discord Yönetim ve Güvenlik Botu</h3>
</div>

Merlin, Discord sunucularınız için gelişmiş koruma ve yönetim özellikleri sunan kapsamlı bir Discord botudur. Türkçe arayüzü, kullanıcı dostu komutları ve güçlü yetenekleriyle Discord sunucunuzu daha güvenli ve yönetilebilir hale getirir.


## ✨ Yenilikler

- **Hem Slash Hem de Önekli Komutlar**: Tüm komutları hem `/komut` hem de `!komut` şeklinde kullanabilirsiniz
- **Gelişmiş Görsel Arayüz**: Renkli, ikonlu ve kategorize edilmiş komut görünümleri
- **Türkçe Arayüz**: Tamamen Türkçe dil desteği ile kullanım kolaylığı
- **Web Yönetim Paneli**: Tarayıcı üzerinden tüm sunucularınızı yönetme imkanı


## 🛡️ Koruma Sistemi (Guard)

- **Anti-Spam Koruması**: Spam mesajları otomatik olarak tespit eder ve engeller
- **Anti-Raid Koruması**: Toplu sunucu baskınlarını tespit eder ve önler
- **Anti-Link Koruması**: İstenmeyen bağlantıları engeller
- **Captcha Doğrulama**: Sunucuya yeni katılanlar için isteğe bağlı captcha doğrulaması sağlar
- **Uyarı Sistemi**: Kural ihlali yapan kullanıcılar için özelleştirilebilir uyarı sistemi
- **Otomatik Moderasyon**: Kurallara aykırı içerikleri otomatik olarak tespit edip kaldırır


## 👮‍♂️ Moderasyon Komutları

- **Ban/Kick/Mute**: Temel moderasyon işlemleri için komutlar
- **Temizleme**: Toplu mesaj silme ve kanal temizleme
- **Yavaş Mod**: Kanal bazlı mesaj gönderme sınırlamaları
- **Rol Yönetimi**: Toplu rol verme/alma işlemleri
- **Susturma**: Geçici veya kalıcı susturma işlemleri
- **Günlük Kayıtları**: Tüm moderasyon işlemlerinin detaylı kayıtları

<div align="center">
  <img src="https://i.imgur.com/vCeUDQP.png" alt="Merlin Bot Moderasyon" width="600"

## 🔧 Yardımcı Araçlar

- **Hoş Geldin Mesajları**: Özelleştirilebilir karşılama mesajları
- **Duyuru Sistemi**: Sunucu duyuruları için komutlar
- **Çekiliş Sistemi**: Kolay kullanımlı çekiliş düzenleme araçları
- **Anket Oluşturma**: Hızlı anket oluşturma
- **Hatırlatıcılar**: Zamanlı hatırlatmalar oluşturma
- **Bilgi Komutları**: Sunucu ve kullanıcı bilgilerini görüntüleme

## 🖥️ Web Arayüzü

Bot aynı zamanda kapsamlı bir web yönetim paneline sahiptir:

- **Sunucu Yönetimi**: Tüm sunucularınızı tek bir yerden yönetin
- **İstatistikler**: Detaylı kullanım istatistikleri ve grafikler
- **Koruma Ayarları**: Guard modülünün tüm özelliklerini özelleştirme
- **Log İzleme**: Tüm aktiviteleri ve moderasyon işlemlerini görüntüleme
- **Komut Yapılandırması**: Komutları açma/kapama ve özelleştirme



## 📋 Komut Listesi

Bot 450'den fazla komut içerir. En sık kullanılan komutlar:

### Moderasyon Komutları
| Komut | Alternatif İsimler | Açıklama |
|-------|-------------------|----------|
| `/ban <kullanıcı> [sebep]` | !ban, !yasakla, !engelle | Kullanıcıyı sunucudan yasaklar |
| `/kick <kullanıcı> [sebep]` | !kick, !at, !tekmele | Kullanıcıyı sunucudan atar |
| `/mute <kullanıcı> <süre> [sebep]` | !mute, !sustur, !sessiz | Kullanıcıyı belirli bir süre susturur |
| `/warn <kullanıcı> [sebep]` | !warn, !uyar, !uyarı | Kullanıcıya uyarı verir |
| `/clear <miktar>` | !clear, !sil, !temizle | Belirtilen sayıda mesajı siler |

### Guard Komutları
| Komut | Açıklama |
|-------|----------|
| `/guard status` | Guard sisteminin durumunu gösterir |
| `/guard antispam <aç/kapat>` | Anti-spam korumasını açar/kapatır |
| `/guard antiraid <aç/kapat>` | Anti-raid korumasını açar/kapatır |
| `/guard antilink <aç/kapat>` | Link engelleme sistemini açar/kapatır |
| `/guard captcha <aç/kapat>` | Captcha doğrulama sistemini açar/kapatır |

### Utility Komutları
| Komut | Alternatif İsimler | Açıklama |
|-------|-------------------|----------|
| `/yardim [komut] [kategori]` | !help, !komutlar, !yardım | Komut listesini veya belirli bir komut/kategori hakkında bilgi gösterir |
| `/ping` | !ping | Botun gecikme süresini gösterir |
| `/istatistik` | !istatistik, !stats | Bot hakkında istatistikleri gösterir |
| `/davet` | !davet, !invite | Bot davet bağlantısını gönderir |

