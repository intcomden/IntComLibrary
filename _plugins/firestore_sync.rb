# Firestore sync generator for Jekyll
# This plugin runs before the site is built and pulls the "texts" collection
# from Firestore via the REST API, writing each document as a markdown file
# under the _texts/ collection. It expects a service account JSON file
# at `assets/js/firebase-admin-key.json` (you must provide your own credentials).

require 'json'
require 'net/http'
require 'uri'

module Jekyll
  class FirestoreSyncGenerator < Generator
    safe true
    priority :high

    def generate(site)
      # Load service account key (replace with your own path)
      key_path = File.join(site.source, 'assets', 'js', 'firebase-admin-key.json')
      unless File.exist?(key_path)
        Jekyll.logger.warn "FirestoreSync:", "Service account key not found at #{key_path}. Skipping sync."
        return
      end
      key = JSON.parse(File.read(key_path))
      token = obtain_access_token(key)
      project_id = key["project_id"]
      uri = URI("https://firestore.googleapis.com/v1/projects/#{project_id}/databases/(default)/documents/texts")
      req = Net::HTTP::Get.new(uri)
      req["Authorization"] = "Bearer #{token}"
      res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |http| http.request(req) }
      unless res.is_a?(Net::HTTPSuccess)
        Jekyll.logger.error "FirestoreSync:", "Failed to fetch documents: #{res.code} #{res.message}"
        return
      end
      data = JSON.parse(res.body)
      docs = data["documents"] || []
      texts_dir = File.join(site.source, "_texts")
      Dir.mkdir(texts_dir) unless Dir.exist?(texts_dir)
      docs.each do |doc|
        name = doc["name"].split("/").last
        fields = doc["fields"]
        front_matter = {
          "title" => fields["title"]["stringValue"],
          "author" => fields["author"] ? fields["author"]["stringValue"] : nil,
          "language" => fields["language"]["stringValue"],
          "description" => fields["description"] ? fields["description"]["stringValue"] : nil,
          "layout" => "text",
          "url" => "/texts/#{name}.html"
        }.compact
        content = fields["content"] ? fields["content"]["stringValue"] : ""
        markdown = "---\n" + front_matter.map { |k, v| "#{k}: #{v}" }.join("\n") + "\n---\n\n" + content + "\n"
        file_path = File.join(texts_dir, "#{name}.md")
        File.write(file_path, markdown)
        Jekyll.logger.info "FirestoreSync:", "Wrote #{file_path}"
      end
    end

    private

    def obtain_access_token(key)
      # JWT for OAuth2 service account token (simplified). In practice use googleauth gem.
      # Here we use a placeholder – the user must replace this with a valid access token.
      "PLACEHOLDER_ACCESS_TOKEN"
    end
  end
end
