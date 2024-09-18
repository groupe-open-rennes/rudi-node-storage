| Auth   | Method | URL               | Description                                       |
| ------ | ------ | ----------------- | ------------------------------------------------- |
| public | GET    | /hash,            | Get application git hash                          |
| public | GET    | /url,             | Get RUDI node Storage public URL                  |
| public | GET    | /schemas,         | JSON schemas of RUDI node Storage module          |
| public | GET    | /schema/:name,    | Get an identified JSON schemas                    |
| public | GET    | /:uuid,           | Get the actual storage URL for an identifed media |
| public | GET    | /check/:uuid,     | Check an identified media status                  |
| public | GET    | /storage/:fileid, | Download a media as a file                        |
| public | GET    | /download/:uuid,  | Download a media as a file                        |
| public | GET    | /zdownload/:uuid, | Download a media as a ZIP file                    |
| jwt    | POST   | /jwt/forge,       | Get a JWT for restricted accesses                 |
| jwt    | POST   | /post,            | Post a new file                                   |
| jwt    | POST   | /commit,          | Confirm the storage of an identifed media         |
| jwt    | POST   | /delete/:uuid,    | Delete an idenified media                         |
| jwt    | GET    | /list,            | List every media                                  |
| jwt    | GET    | /logs,            | Access logs                                       |
