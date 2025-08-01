;; ByteSentry - Registry Contract
;; Author: @yourname
;; Description: Registers protocols seeking audit scores and tracks metadata

;; --------------------
;; Constants & Errors
;; --------------------

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-ALREADY-REGISTERED u101)
(define-constant ERR-NOT-REGISTERED u102)
(define-constant ERR-NOT-OWNER u103)

;; --------------------
;; Data Variables
;; --------------------

(define-data-var admin principal tx-sender)

;; Protocol structure: owner, name, metadata (string), active status
(define-map protocols principal 
  {
    owner: principal,
    name: (string-utf8 64),
    meta: (string-utf8 256),
    active: bool
  }
)

;; --------------------
;; Private Helpers
;; --------------------

(define-private (is-admin (caller principal))
  (is-eq caller (var-get admin))
)

(define-private (only-admin)
  (asserts! (is-admin tx-sender) (err ERR-NOT-AUTHORIZED))
)

(define-private (is-protocol-owner (protocol principal))
  (match (map-get? protocols protocol)
    entry (is-eq tx-sender (get owner entry))
    false
  )
)

;; --------------------
;; Public Functions
;; --------------------

(define-public (register-protocol (protocol principal) (name (string-utf8 64)) (meta (string-utf8 256)))
  (begin
    (only-admin)
    (asserts! (is-none (map-get? protocols protocol)) (err ERR-ALREADY-REGISTERED))
    (map-set protocols protocol {
      owner: protocol,
      name: name,
      meta: meta,
      active: true
    })
    (ok true)
  )
)

(define-public (deactivate-protocol (protocol principal))
  (begin
    (asserts! (is-protocol-owner protocol) (err ERR-NOT-OWNER))
    (match (map-get? protocols protocol)
      entry (map-set protocols protocol (merge entry { active: false }))
      (err ERR-NOT-REGISTERED)
    )
    (ok true)
  )
)

(define-public (update-metadata (protocol principal) (new-meta (string-utf8 256)))
  (begin
    (asserts! (is-protocol-owner protocol) (err ERR-NOT-OWNER))
    (match (map-get? protocols protocol)
      entry (map-set protocols protocol (merge entry { meta: new-meta }))
      (err ERR-NOT-REGISTERED)
    )
    (ok true)
  )
)

(define-public (transfer-ownership (protocol principal) (new-owner principal))
  (begin
    (asserts! (is-protocol-owner protocol) (err ERR-NOT-OWNER))
    (match (map-get? protocols protocol)
      entry (map-set protocols protocol (merge entry { owner: new-owner }))
      (err ERR-NOT-REGISTERED)
    )
    (ok true)
  )
)

(define-public (transfer-admin (new-admin principal))
  (begin
    (only-admin)
    (var-set admin new-admin)
    (ok true)
  )
)

;; --------------------
;; Read-Only Functions
;; --------------------

(define-read-only (get-protocol (protocol principal))
  (match (map-get? protocols protocol)
    entry (ok entry)
    (err ERR-NOT-REGISTERED)
  )
)

(define-read-only (is-registered (protocol principal))
  (is-some (map-get? protocols protocol))
)

(define-read-only (is-active (protocol principal))
  (match (map-get? protocols protocol)
    entry (get active entry)
    false
  )
)

(define-read-only (get-admin)
  (ok (var-get admin))
)

;; ---------------
;; END OF CONTRACT
;; ---------------
