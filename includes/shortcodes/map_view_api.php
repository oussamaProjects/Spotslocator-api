<?php
function map_view_api($atts)
{
    ob_start();
    ?>

<article id="mapfindspots" class="fr mapfindspots">

    <div>

        <div class="row">
            <div class="col-md-12">
                <p>
                    Entrez une ville, un département ou un code postal dans le champ ci-dessous, ou sélectionnez un
                    département
                    directement sur la carte
                </p>

                <p id="map_error_msg" class="d-none"></p>

                <input name="google_loc" placeholder="Indiquez un lieu" type="text" id="google_loc" class="google_loc" data-required="1" />

            </div>
        </div>

        <div class="row no-gutters d-flex flex-column-reverse flex-md-row" id="map_container">
            <div class="col-md-3">
                <div id="training_center_list">
                    <div class="center_number">centres trouvés.</div>
                    <div class="oversized_results">Veuillez zoomer pour afficher la liste.</div>
                    <div id="dialog_training_center_detail">
                        <div class="box-close">
                            <div class="under-box-close">
                                <a class="dialog_training_close" data-dismiss="modal">
                                    <span id="" aria-hidden="true">&times;</span>
                                </a>
                            </div>
                        </div>

                        <div class="content_area">
                            <div class="messageadmin" id="dialog_training_center_detail_error"></div>
                            <div class="trainingcentersdetails">

                                <div class="d-flex flex-sm-row flex-column-reverse justify-content-between">
                                    <div class="referent">
                                        <h4 class="ref ">Référent:</h4>
                                        <div><span class="info-label">Nom: </span><span class="nom_ref"></span> </div>
                                        <div><span class="info-label">Téléphone:</span> <span class="tel_ref"></span>
                                        </div>
                                        <div><span class="info-label">Adresse e-mail: </span><span
                                                class="email_ref"></span> </div>
                                    </div>
                                    <a class="logo_url" target="_blank"> <img src="#" class="logo" alt=""> </a>
                                </div>

                                <div class="center">
                                    <h4 class="address">Center: </h4>
                                    <div> <span class="info-label"> Nom: </span><span class="nom_center"></span></div>
                                    <div>
                                        <span class="info-label"> Adresse : </span>
                                        <span class="street"></span>
                                        <span class="zispan"></span>
                                        <span class="cit"></span>
                                    </div>
                                    <div><span class="info-label">Téléphone:</span> <span class="tel_center"></span>
                                    </div>
                                    <div><span class="info-label">Adresse e-mail: </span><span
                                            class="email_center"></span> </div>
                                    <div class="website_center"><span class="info-label">Site Web: </span><a href="#"
                                            target="_blank">Website</a></div>
                                </div>

                                <div class="d-flex flex-sm-row flex-column">
                                    <div class="contact_center">
                                        <a href="#" class="btn btn-custom">Contacer le centre </a>
                                    </div>

                                    <div class="see_map_g btn btn-custom">Zoomer sur la carte</div>
                                </div>

                                <p class="text"></p>

                                <div class="info-slider"></div>

                            </div>
                            <input type="hidden" name="postback_message" value="" />
                            <div class="image-slide-container"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-9">
                <div id="map" data-trainingcenters=""></div>
            </div>
        </div>

        <input type="hidden" name="map_place" value="" id="map_place" />
        <input type="hidden" name="zoom" value="zoomer sur la carte" id="zoom" />

    </div>

</article>

<div class="shadow"></div>

<?php
$map = ob_get_clean();
    return $map;
}